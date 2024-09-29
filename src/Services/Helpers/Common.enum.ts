const config = require("../../../config.json")

export enum UserType {
    HOSPITAL = config.common.UserType.hospital,
    DOCTOR = config.common.UserType.doctor,
    PATIENT = config.common.UserType.patient
}

export enum UserStatus {
    ACTIVE = config.common.UserStatus.active,
    ONHOLD = config.common.UserStatus.onhold,
    INACTIVE = config.common.UserStatus.inactive
}

export enum Gender {
    MALE = config.common.Gender.Male,
    FEMALE = config.common.Gender.Female
}

export enum ErrorMessage {
    invalidValueErrorMessage = config.Error.InvalidValueMessage,
    invalidTokenErrorMessage = config.Error.InvalidTokenErrorMessage,
    missingAuthToken = config.Error.MissingAuthToken,
    incorrectType = config.Error.IncorrectType
}

export enum Mode {
    RESPONSE = "Response"
}

export enum ErrorTypes {
    ValidationError = "ValidationError",
    NotFoundError = "NotFoundError",
    DatabaseError = "DatabaseError",
    UnauthorizedError = "Unauthorized",
    UnsupportedRequestBody = "UnsupportedRequestBody",
    InvalidObjectId = "InvalidObjectId",
    MissingAuthToken = "MissingAuthToken",
    IncorrectType = "IncorrectType"
}
