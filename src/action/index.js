import { onThemeChange } from './theme/index'
import {onLoadRefreshPopular,onLoadMorePupular,onFlushPopularFavorite} from './popular/index'
import { onLoadRefreshTrending,onLoadMoreTrending,onFlushTrendingFavorite} from './trending/index'
import { onLoadFavoriteData } from './favorite/index'

export default{
	onThemeChange,
	onLoadRefreshPopular,
	onLoadMorePupular,
	onLoadRefreshTrending,
	onLoadMoreTrending,
	onLoadFavoriteData,
	onFlushPopularFavorite,
	onFlushTrendingFavorite
}