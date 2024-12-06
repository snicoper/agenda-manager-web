export class BreadcrumbItem {
  label: string;
  link: string;
  icon: string;
  active: boolean;

  constructor(label: string, link: string, icon = '', activate = true) {
    this.label = label;
    this.link = link;
    this.icon = icon;
    this.active = activate;
  }
}
