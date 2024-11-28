export class BreadcrumbItem {
  text: string;
  link: string;
  icon: string;
  active: boolean;

  constructor(text: string, link: string, icon = '', activate = true) {
    this.text = text;
    this.link = link;
    this.icon = icon;
    this.active = activate;
  }
}
