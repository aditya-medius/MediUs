declare namespace Express {
  interface Request {
    currentDoctor: Object<any>;
    currentPatient: Object<any>;
    currentHospital: Object<any>;
    currentAdmin: Object<any>;
    currentAgent: Object<any>;
    currentSuvedha: Object<any>;
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
