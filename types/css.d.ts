// Allow importing CSS (and CSS Modules) used by the web target.
declare module "*.css";

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
