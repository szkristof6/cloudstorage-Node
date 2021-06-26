const types = [{
        "type": ["video"],
        "icon": "fas fa-film",
        "name": "Video"
    },
    {
        "type": ["pdf"],
        "icon": "far fa-file-pdf",
        "name": "PDF"
    },
    {
        "type": ["audio", "x-cdf"],
        "icon": "far fa-file-audio",
        "name": "Hang"
    },
    {
        "type": ["image"],
        "icon": "far fa-file-image",
        "name": "Kép"
    },
    {
        "type": ["text"],
        "icon": "far fa-file-alt",
        "name": "Szöveg fájl"
    },
    {
        "type": ["x-freearc", "x-bzip", "x-bzip2", "gzip", "java-archive", "vnd.rar",
            "x-tar", "zip", "x-7z-compressed", "octet-stream"
        ],
        "icon": "far fa-file-archive",
        "name": "Tömörített archívum"
    },
    {
        "type": ["msword", "vnd.openxmlformats-officedocument.wordprocessingml.document",
            "vnd.oasis.opendocument.text"
        ],
        "icon": "far fa-file-word",
        "name": "Word-file"
    },
    {
        "type": ["x-x509-ca-cert"],
        "icon": "fas fa-key",
        "name": "Key-file"
    },
    {
        "type": ["vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
        "icon": "fas fa-file-excel",
        "name": "Excel-file"
    },
];

const iconByFormat = (item) => {
    const foundIcon = types.filter(x => x.type.includes(item.meta.type)).pop();

    return {
        icon: foundIcon.icon,
        name: foundIcon.name
    }

};

module.exports = iconByFormat;

