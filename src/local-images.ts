import * as fs from "fs";
import { Photo } from "./Photo"

const FOLDER_PATH = "C:/ScreenSaver";

export function getPhotos(): Promise<Photo[]>
{
	let folderPath = FOLDER_PATH;
	if(!folderPath.endsWith("/"))
		folderPath += "/";

	let fileNames = fs.readdirSync(folderPath);

	let photos = fileNames
		.filter(fn => fn.match(/\.(jpg|jpeg)$/i) != null)
		.map(fn => ({
			url: `file:///${folderPath}${fn}`,
			title: null,
			attribution: null,
		}));

	return Promise.resolve(photos);
}
