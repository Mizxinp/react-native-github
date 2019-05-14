import { FLAG_STORAGE } from '../expand/storage/DataStore'

export default class FavoriteUtil{
	static onFavorite(favoriteDao, item, isFavorite, flag) {
		const key = flag === FLAG_STORAGE.flag_trending ? item.fullName : item.id.toString();
		if (isFavorite) {
				favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
		} else {
				favoriteDao.removeFavoriteItem(key);
		}
	}
}