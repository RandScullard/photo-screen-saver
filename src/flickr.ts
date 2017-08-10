// This product uses the Flickr API but is not endorsed or certified by Flickr.

import { FLICKR_API_KEY } from "./api-keys"
import { Photo } from "./Photo"
import { downloadString, isNullOrEmpty } from "./Utils"

const FLICKR_URL = `https://api.flickr.com/services/rest?api_key=${FLICKR_API_KEY}&method=flickr.interestingness.getList&format=json&nojsoncallback=1&extras=url_k,owner_name&per_page=500`;

interface FlickrError
{
	stat: string;
	code: number;
	message: string;
}

interface FlickrPhotoData
{
	photos: {
		photo: FlickrPhoto[];
	}
}

interface FlickrPhoto
{
	title: string;
	ownername: string;
	url_k: string;
	height_k: string;
	width_k: string;
};

export function getPhotos(): Promise<Photo[]>
{
	return downloadString(FLICKR_URL)
	.then(json =>
	{
		let data = JSON.parse(json);

		let error = data as FlickrError;
		if(!isNullOrEmpty(error.message))
			throw new Error(`Failed to load list of photos from Flickr: ${error.message}`);

		let photoData = data as FlickrPhotoData;

		let photos = photoData.photos.photo
		.filter(photo => !isNullOrEmpty(photo.url_k))
		.map(photo => ({
			url: photo.url_k,
			width: parseFloat(photo.width_k),
			height: parseFloat(photo.height_k),
			title: photo.title,
			attribution: `© ${photo.ownername} / Flickr`,
		}))
		.filter(photo => 
		{
			let aspectRatio = photo.width / photo.height;
			return photo.width >= 1600 && aspectRatio >= 1.5 && aspectRatio <= 1.9;
		});

		return photos;
	});
}
