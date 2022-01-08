declare namespace Express {
  interface Request {
    currentDoctor: Object<any>;
    currentPatient: Object<any>;
    currentHospital: Object<any>;
    currentAdmin: Object<any>;
  }
}
