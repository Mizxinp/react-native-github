import { onThemeChange,onShowCustomThemeView,onThemeInit } from './theme/index'
import {onLoadRefreshPopular,onLoadMorePupular,onFlushPopularFavorite} from './popular/index'
import { onLoadRefreshTrending,onLoadMoreTrending,onFlushTrendingFavorite} from './trending/index'
import { onLoadFavoriteData } from './favorite/index'
import { onLoadLanguage } from './language/index'

export default{
	onLoadRefreshPopular,
	onLoadMorePupular,
	onLoadRefreshTrending,
	onLoadMoreTrending,
	onLoadFavoriteData,
	onFlushPopularFavorite,
	onFlushTrendingFavorite,
	onLoadLanguage,
	onThemeChange,
	onShowCustomThemeView,
	onThemeInit
}