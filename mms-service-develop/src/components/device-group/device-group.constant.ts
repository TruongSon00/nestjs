export const DEVICE_GROUP_CONST = {
  ID: {
    COLUMN: '_id',
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
    COLUMN: 'description',
  },
  CODE: {
    MAX_LENGTH: 7,
    COLUMN: 'code',
    REGEX: /^[a-zA-Z0-9]+$/
  },
  NAME: {
    MAX_LENGTH: 255,
    COLUMN: 'name',
    REGEX: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ 0-9]+$/
  },
  COLL: 'deviceGroups',
};
export enum DeviceGroupStatusConstant {
  AWAITING,
  CONFIRMED,
  COMPLETED,
}
export const STATUS_TO_DELETE_OR_UPDATE_DEVICE_GROUP = [
  DeviceGroupStatusConstant.AWAITING,
];
export const DEVICE_GROUP_NAME = 'device-group';
export const DEVICE_GROUP_HEADER = [
  {
    from: 'i',
  },
  {
    from: '_id',
  },
  {
    from: 'code',
  },
  {
    from: 'name',
  },
  {
    from: 'description',
  },
  {
    from: 'status',
  },
  {
    from: 'createdAt',
  },
  {
    from: 'updatedAt',
  },
  {
    from: 'responsibleUser',
  },
];

export const IMPORT_DEVICE_GROUP_CONST = {
  FILE_NAME: 'import_device_group_template.xlsx',
  ENTITY_KEY: 'device-group',
  COLUMNS: ['code', 'name', 'description', 'responsibleUser'],
  REQUIRED_FIELDS: ['code', 'name', 'responsibleUser'],
};
