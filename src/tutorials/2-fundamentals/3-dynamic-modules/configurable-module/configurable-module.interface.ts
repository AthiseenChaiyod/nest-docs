export interface ConfigurableModuleInterface {
  username: string;
  password: string;
  email: string;
}

export interface ConfigurableModuleExtraInterface {
  first_name: string;
  last_name: string;
  age: number;
  gender: 'male' | 'female';
}
