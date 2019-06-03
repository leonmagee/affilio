import { createMaterialTopTabNavigator } from 'react-navigation';
// import PromotionsFeatured from './PromotionsFeatured';
import PromotionsNew from './PromotionsNew';
import PromotionsExclusive from './PromotionsExclusive';
import PromotionsExpiring from './PromotionsExpiring';
import { colors } from '../Styles/variables';

const SlideNavigator = createMaterialTopTabNavigator(
  {
    // Featured: PromotionsFeatured,
    New: PromotionsNew,
    Exclusive: PromotionsExclusive,
    Expiring: PromotionsExpiring,
  },
  {
    tabBarOptions: {
      activeTintColor: '#444',
      inactiveTintColor: '#656565',
      indicatorStyle: {
        backgroundColor: colors.brandPrimary,
        height: 4,
      },
      labelStyle: {
        fontSize: 11,
        fontFamily: 'Lato-Bold',
      },
      tabStyle: {
        paddingVertical: 4,
      },
      style: {
        backgroundColor: '#fff',
        paddingVertical: 10,
      },
    },
  }
);

export default SlideNavigator;
