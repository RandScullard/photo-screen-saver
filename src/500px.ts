// This product uses the 500px API but is not endorsed or certified by 500px.

import { _500PX_API_KEY } from "./api-keys"
import { Photo } from "./Photo"
import { downloadString } from "./Utils"

const _500PX_URL = `https://api.500px.com/v1/photos?consumer_key=${_500PX_API_KEY}&feature=popular&sort=highest_rating&rpp=100&image_size=2048&only=Abstract,Aerial,Animals,Landscapes,Macro,Nature,Night,Underwater`;

interface _500pxPhotoData
{
	photos: _500pxPhoto[];
}

interface _500pxPhoto
{
	image_url: string;
	width: number;
	height: number;
	name: string;
	user: {
		fullname: string;
	}
}

export function getPhotos(): Promise<Photo[]>
{
	return downloadString(_500PX_URL)
	.then(json =>
	{
		let photoData = JSON.parse(json) as _500pxPhotoData;

		let photos = photoData.photos
		.map(photo => ({
			url: photo.image_url,
			width: photo.width,
			height: photo.height,
			title: photo.name,
			attribution: `© ${photo.user.fullname} / 500px`,
		}))
		.filter(photo => 
		{
			let aspectRatio = photo.width / photo.height;
			return photo.width >= 1600 && aspectRatio >= 1.5 && aspectRatio <= 1.9;
		});

		return photos;
	});
}
