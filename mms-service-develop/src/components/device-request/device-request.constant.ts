export const DEVICE_REQUEST_CONST = {
  CODE: {
    MAX_LENGTH: 12,
    COLUMN: 'code',
    PAD_CHAR: '0',
    DEFAULT_CODE: 0,
    GAP: 1,
    REGEX: /^[a-zA-Z0-9]+$/
  },
  NAME: {
    MAX_LENGTH: 255,
    COLUMN: 'name',
    REGEX: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/
  },
  STATUS: {
    COLUMN: 'status',
  },
  TYPE: {
    COLUMN: 'type',
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  DEVICE: {
    CODE: {
      COLUMN: 'deviceCode',
    },
    NAME: {
      COLUMN: 'deviceName',
    },
    USER: {
      COLUMN: 'user',
    },
    SERIAL: {
      COLUMN: 'serial',
    },
  },
  REQUEST_TICKET: {
    COLL: 'deviceRequestTickets',
  },
  RETURN_TICKET: {
    COLL: 'deviceReturnTickets',
  },
  QUANTITY: {
    COLUMN: 'quantity',
  },
};

export enum DeviceRequestType {
  Request,
  Return,
}

export enum ListDeviceRequestStatus {
  AwaitingConfirmation,
  AwaitingITConfirmation,
  Confirmed,
  AwaitingAssignment,
  Assigned,
  AwaitingReturn,
  Returned,
  Rejected,
  WaitingExport,
  Installed,
}

export const DEVICE_REQUEST_PREFIX_NAME = 'Yêu cầu cấp';
