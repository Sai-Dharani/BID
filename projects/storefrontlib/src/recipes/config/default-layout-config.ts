import { LayoutConfig } from '@spartacus/storefront';

export const layoutConfig: LayoutConfig = {
  breakpoints: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1400,
  },
  layoutSlots: {
    header: {
      lg: {
        slots: [
          'PreHeader',
          //'TopHeaderSlot',
          //'SiteLogo',
          //'SiteLogin',
          //'NavigationBar',
          // 'SearchBox',
          // 'BottomHeaderSlot',              
          // 'HomepageNavLink'
        ],
      },
      slots: ['PreHeader']
    },
     navigation: {      
      lg: { 
        slots: [] 
      },      
      slots: ['SiteLogin','NavigationBar', 'SiteContext', 'SiteLinks'],    
    },
    LoginPageTemplate: {
      slots: [
        'LeftContentSlot',
        'RightContentSlot'
      ]
    },
    AccountPageTemplate: {
      slots: [
        'BodyContent',
      ]
    }
  }
};
