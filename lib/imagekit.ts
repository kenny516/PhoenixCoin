import ImageKit from 'imagekit-javascript';

export const imagekit = new ImageKit({
    publicKey: "public_xmdF2vVndmDReO+qSJCJS63j2Ag=",
    urlEndpoint: "https://ik.imagekit.io/hsu00tyck"
});

interface UploadResponse {
    fileId: string;
    url: string;
    name: string;
}


