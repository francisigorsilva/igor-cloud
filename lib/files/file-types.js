const FILE_TYPES = {
  image: ["jpg","jpeg","png","gif","webp","bmp","avif","jfif","svg","tif","tiff","heic","heif","ico","raw","cr2","nef","arw","dng"],
  video: ["mp4","webm","mov","m4v","ogv","ogg","avi","mkv","wmv","flv","mpeg","mpg","3gp","mts","m2ts","vob"],
  audio: ["mp3","wav","ogg","m4a","flac","aac","wma","opus","aiff","aif","mid","midi","amr"],
  pdf: ["pdf"],
  document: ["doc","docx","odt","rtf","txt","md","epub","pages","tex","wps","wpd"],
  spreadsheet: ["xls","xlsx","xlsm","xlsb","csv","ods","numbers","tsv"],
  presentation: ["ppt","pptx","pps","ppsx","odp","key"],
  design: ["cdr","ai","eps","psd","psb","sketch","fig","xd","indd","idml","afdesign","afphoto","afpub","xcf","blend","dwg","dxf","3ds","obj","stl","fbx","glb","gltf"],
  archive: ["zip","rar","7z","tar","gz","bz2","xz","tgz","zst","cab","iso","dmg"],
  code: ["js","jsx","ts","tsx","html","htm","css","scss","sass","less","json","xml","yaml","yml","py","java","c","h","cpp","hpp","cs","php","rb","go","rs","swift","kt","sql","sh","bat","ps1","vue","svelte","astro","graphql","prisma","env","log"],
  font: ["ttf","otf","woff","woff2","eot"],
  ebook: ["mobi","azw","azw3","djvu","djv"],
  data: ["db","sqlite","sqlite3","bak","dat","bin","xml","jsonl","parquet"]
};
const MIME_TYPES = {
  image:"image/*",video:"video/*",audio:"audio/*",pdf:"application/pdf",document:"application/*",spreadsheet:"application/*",presentation:"application/*",design:"application/octet-stream",archive:"application/octet-stream",code:"text/plain",font:"font/*",ebook:"application/octet-stream",data:"application/octet-stream",other:"application/octet-stream"
};
export function getExtension(fileName){const name=String(fileName||"").toLowerCase();const lastDot=name.lastIndexOf(".");if(lastDot<=0||lastDot===name.length-1)return "";return name.slice(lastDot+1);}
export function getFileType(fileName){const extension=getExtension(fileName);for(const [type,extensions] of Object.entries(FILE_TYPES)){if(extensions.includes(extension))return type;}return "other";}
export function getFileLabel(fileName){const extension=getExtension(fileName);return extension?extension.slice(0,5).toUpperCase():"ARQ";}
export function getMimeType(fileName){const type=getFileType(fileName);const specificTypes={jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",gif:"image/gif",webp:"image/webp",svg:"image/svg+xml",mp4:"video/mp4",webm:"video/webm",mov:"video/quicktime",mp3:"audio/mpeg",wav:"audio/wav",pdf:"application/pdf",txt:"text/plain",html:"text/html",css:"text/css",js:"text/javascript",json:"application/json",zip:"application/zip"};return specificTypes[getExtension(fileName)]||MIME_TYPES[type];}
export function getFileCategoryName(type){const names={image:"Imagem",video:"Vídeo",audio:"Áudio",pdf:"PDF",document:"Documento",spreadsheet:"Planilha",presentation:"Apresentação",design:"Design gráfico",archive:"Arquivo compactado",code:"Código",font:"Fonte",ebook:"E-book",data:"Dados",other:"Outro arquivo"};return names[type]||"Outro arquivo";}
