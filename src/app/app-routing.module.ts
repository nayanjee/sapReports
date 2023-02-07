import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseLayoutComponent } from './Layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';

// Dashboards
import { AnalyticsComponent } from './DemoPages/Dashboards/analytics/analytics.component';

// Pages
import { ForgotPasswordBoxedComponent } from './DemoPages/UserPages/forgot-password-boxed/forgot-password-boxed.component';
// import { LoginBoxedComponent } from './DemoPages/UserPages/login-boxed/login-boxed.component';
import { LoginBoxedComponent } from './login/login-boxed.component';
import { RegisterBoxedComponent } from './DemoPages/UserPages/register-boxed/register-boxed.component';

// Components
import { ModalsComponent } from './DemoPages/Components/modals/modals.component';
import { TooltipsPopoversComponent } from './DemoPages/Components/tooltips-popovers/tooltips-popovers.component';

import { OwnerCreateComponent } from './Owners/owner-create/owner-create.component';
import { OwnerUpdateComponent } from './Owners/owner-update/owner-update.component';
import { OwnerCommercialComponent } from './Owners/owner-commercial/owner-commercial.component';
import { OwnerResidentialComponent } from './Owners/owner-residential/owner-residential.component';

import { AssetCreateComponent } from './Assets/asset-create/asset-create.component';
import { AssetUpdateComponent } from './Assets/asset-update/asset-update.component';
import { AssetCommercialComponent } from './Assets/asset-commercial/asset-commercial.component';
import { AssetResidentialComponent } from './Assets/asset-residential/asset-residential.component';

import { PaymentComponent } from './Payments/payment.component';

import { NayanComponent } from './nayan/nayan.component';
import { OrderComponent } from './month/order/order.component';
import { TorderComponent } from './midmonth/order/torder.component';
import { GiftCardComponent } from './month/giftCard/giftCard.component';
import { LastStockComponent } from './month/lastStock/lastStock.component';
import { ImportBatchComponent } from './Import/batch/batch.component';
import { DivisionComponent } from './Master/Divisions/division.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: '', component: AnalyticsComponent, data: {extraParameter: 'dashboardsMenu'} },
      { path: 'owner', component: OwnerResidentialComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'owners', component: OwnerResidentialComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'owner/commercial', component: OwnerCommercialComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'owner/residential', component: OwnerResidentialComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'owner/create', component: OwnerCreateComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'owner/create/:type', component: OwnerCreateComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'owner/update', component: OwnerUpdateComponent, data: {extraParameter: 'ownerElementsMenu'} },

      { path: 'asset/create', component: AssetCreateComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'asset/create/:owner', component: AssetCreateComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'asset/update', component: AssetUpdateComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'asset/residential', component: AssetResidentialComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'asset/commercial', component: AssetCommercialComponent, data: {extraParameter: 'ownerElementsMenu'} },
      
      { path: 'payments', component: PaymentComponent, data: {extraParameter: 'ownerElementsMenu'} },


      { path: 'nayan', component: NayanComponent, data: {extraParameter: 'ownerElementsMenu'} },
      { path: 'month/lastStock', component: LastStockComponent, data: {extraParameter: 'monthElementsMenu'} },
      { path: 'month/order', component: OrderComponent, data: {extraParameter: 'monthElementsMenu'} },
      { path: 'month/giftCard', component: GiftCardComponent, data: {extraParameter: 'monthElementsMenu'} },
      { path: 'import/batch', component: ImportBatchComponent, data: {extraParameter: 'importElementsMenu'} },
      { path: 'master/division', component: DivisionComponent, data: {extraParameter: 'divisionElementsMenu'} },

      { path: 'midmonth/order', component: TorderComponent, data: {extraParameter: 'midmonthElementsMenu'} },

      // Components
      { path: 'components/modals', component: ModalsComponent, data: {extraParameter: 'componentsMenu'} },
      { path: 'components/tooltips-popovers', component: TooltipsPopoversComponent, data: {extraParameter: 'componentsMenu'} },
    ]
  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [
      // User Pages
      { path: 'login', component: LoginBoxedComponent, data: {extraParameter: ''} },
      { path: 'pages/register-boxed', component: RegisterBoxedComponent, data: {extraParameter: ''} },
      { path: 'pages/forgot-password-boxed', component: ForgotPasswordBoxedComponent, data: {extraParameter: ''} },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    relativeLinkResolution: 'legacy'
    }
  )],
  exports: [RouterModule]
})

export class AppRoutingModule {
  
}
