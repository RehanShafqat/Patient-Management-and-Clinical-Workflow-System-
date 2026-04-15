import { Request } from "express";

export interface PaginatedResult<T> {
  current_page: number;
  data: T[];
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export function getPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  req: Request
): PaginatedResult<T> {
  const last_page = Math.ceil(total / limit) || 1;
  const current_page = Math.min(page, last_page);

  const from = total === 0 ? null : (current_page - 1) * limit + 1;
  const to = total === 0 ? null : Math.min(current_page * limit, total);

  const protocol = req.protocol || "http";
  const host = req.get("host") || "localhost";
  const baseUrl = `${protocol}://${host}${req.originalUrl.split("?")[0]}`;

  const buildUrl = (p: number) => {
    const url = new URL(baseUrl);
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== "page") {
        url.searchParams.set(key, String(value));
      }
    }
    url.searchParams.set("page", p.toString());
    return url.toString();
  };

  const links = [];
  links.push({
    url: current_page > 1 ? buildUrl(current_page - 1) : null,
    label: "&laquo; Previous",
    active: false,
  });

  for (let i = 1; i <= last_page; i++) {
    links.push({
      url: buildUrl(i),
      label: i.toString(),
      active: i === current_page,
    });
  }

  links.push({
    url: current_page < last_page ? buildUrl(current_page + 1) : null,
    label: "Next &raquo;",
    active: false,
  });

  return {
    current_page,
    data,
    first_page_url: buildUrl(1),
    from,
    last_page,
    last_page_url: buildUrl(last_page),
    links,
    next_page_url: current_page < last_page ? buildUrl(current_page + 1) : null,
    path: baseUrl,
    per_page: limit,
    prev_page_url: current_page > 1 ? buildUrl(current_page - 1) : null,
    to,
    total,
  };
}
