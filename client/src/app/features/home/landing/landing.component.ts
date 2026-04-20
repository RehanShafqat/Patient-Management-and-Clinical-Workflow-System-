import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  navLinks = ['Solutions', 'Security', 'Research', 'Enterprise'];

  orgs = [
    'MayoClinic',
    'JohnsHopkins',
    'ClevelandClinic',
    'KaiserPermanente',
    'StanfordMed',
  ];

  features = [
    {
      icon: 'database',
      title: 'Patient Registry',
      description:
        'Comprehensive longitudinal patient tracking with integrated genomic data and multi-center history synchronization.',
      tags: ['Unified Records', 'HL7/FHIR Integrated'],
      dark: false,
      stat: null,
      cta: null,
    },
    {
      icon: 'clipboard',
      title: 'Case Management',
      description:
        'Collaborative workflow engine for complex, multi-disciplinary team rounds.',
      tags: [],
      dark: true,
      stat: null,
      cta: 'Explore Module',
    },
    {
      icon: 'user',
      title: 'Doctor Portals',
      description:
        'Personalized dashboards featuring real-time telemetry, peer review tools, and automated editorial summaries.',
      tags: [],
      dark: false,
      stat: '4,200+ Specialists',
      cta: null,
    },
    {
      icon: 'shield',
      title: 'Security & Compliance',
      description:
        'Enterprise-grade security is baked into every layer of ClinicalCurator. We exceed international standards for medical data protection.',
      tags: [],
      dark: false,
      stat: null,
      cta: null,
    },
  ];

  certs = [
    { label: 'HIPAA', sub: 'Verified' },
    { label: 'GDPR', sub: 'Compliant' },
    { label: 'ISO 27001', sub: 'Certified' },
  ];

  avatarColors = [
    'from-teal-400 to-cyan-600',
    'from-blue-400 to-indigo-600',
    'from-violet-400 to-purple-600',
  ];

  footerCols = [
    {
      heading: 'Product',
      links: ['Solutions', 'Case Studies', 'Integrations'],
    },
    {
      heading: 'Resources',
      links: ['Documentation', 'Research Papers', 'Whitepapers'],
    },
    {
      heading: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance'],
    },
    {
      heading: 'Support',
      links: ['Contact Support', 'API Status', 'Help Center'],
    },
  ];
}
