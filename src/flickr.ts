// This product uses the Flickr API but is not endorsed or certified by Flickr.

import { FLICKR_API_KEY } from "./api-keys"
import { Photo } from "./Photo"
import { downloadString, isNullOrEmpty } from "./Utils"

// Group: Flickr's Best Landscape Photographers (Post 1 Award 2)
const FLICKR_URL = `https://api.flickr.com/services/rest?api_key=${FLICKR_API_KEY}&method=flickr.photos.search&group_id=830711%40N25&orientation=landscape&dimension_search_mode=min&width=2048&sort=date-posted-desc&format=json&nojsoncallback=1&extras=url_k,owner_name&per_page=500`;

interface FlickrError
{
	stat: string;
	code: number;
	message: string;
}

interface FlickrPhotoData
{
	photos: {
		pages: number;
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

export async function getPhotos(): Promise<Photo[]>
{
	let photos: Photo[] = [];

	// This code supports loading multiple pages of search results, but querying each page takes quite a while.
	// To keep the startup time as quick as possible, you can use the initial value of totalPages to limit the
	// number of pages that will be loaded, while still returning enough photos to give you sufficient variety.
	// For example, if the Flickr group being searched has hundreds of suitable search hits on the first page,
	// there's no need to get any more pages; in this case initialize totalPages to 1.
	let totalPages = 1;
	let currPage = 1;

	while(currPage <= totalPages)
	{
		let json = await downloadString(FLICKR_URL + `&page=${currPage}`);

		let data = JSON.parse(json);

		let error = data as FlickrError;
		if(!isNullOrEmpty(error.message))
			throw new Error(`Failed to load list of photos from Flickr: ${error.message}`);

		let photoData = data as FlickrPhotoData;

		totalPages = Math.min(totalPages, photoData.photos.pages);

		let currPhotos = photoData.photos.photo
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

		photos = photos.concat(currPhotos);

		currPage++;
	}

	return photos;
}
