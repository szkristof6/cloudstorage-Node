const types = [
  {
    type: ['video'],
    icon: 'film',
    name: 'Video',
  },
  {
    type: ['pdf'],
    icon: 'file-pdf',
    name: 'PDF',
  },
  {
    type: ['audio', 'x-cdf'],
    icon: 'file-audio',
    name: 'Hang',
  },
  {
    type: ['image'],
    icon: 'file-image',
    name: 'Kép',
  },
  {
    type: ['text'],
    icon: 'file-alt',
    name: 'Szöveg fájl',
  },
  {
    type: [
      'x-freearc',
      'x-bzip',
      'x-bzip2',
      'gzip',
      'java-archive',
      'vnd.rar',
      'x-tar',
      'zip',
      'x-7z-compressed',
      'octet-stream',
    ],
    icon: 'file-archive',
    name: 'Tömörített archívum',
  },
  {
    type: [
      'msword',
      'vnd.openxmlformats-officedocument.wordprocessingml.document',
      'vnd.oasis.opendocument.text',
    ],
    icon: 'file-word',
    name: 'Word-file',
  },
  {
    type: ['x-x509-ca-cert'],
    icon: 'key',
    name: 'Key-file',
  },
  {
    type: ['vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    icon: 'file-excel',
    name: 'Excel-file',
  },
];

const iconByFormat = (item) => {
  const type = item.meta.type.split('/');
  const foundIcon = types
    .filter((x) => x.type.some((r) => type.includes(r)))
    .pop();

  return {
    icon: foundIcon ? foundIcon.icon : 'question-circle',
    name: foundIcon ? foundIcon.name : 'Ismeretlen fájl',
  };
};

module.exports = iconByFormat;
