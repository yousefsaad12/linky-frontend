export type EndpointParam = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

export type Endpoint = {
  id: string;
  category: "redirect" | "url" | "analytics";
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  authRequired: boolean;
  headers?: EndpointParam[];
  queryParams?: EndpointParam[];
  bodyParams?: EndpointParam[];
  responseDescription: string;
};

export type DocsCategory = {
  title: string;
  icon: React.ReactNode;
  items: Array<{
    id: string;
    label: string;
  }>;
};
