import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgReduxModule } from '@angular-redux/store';
import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { rootReducer, ArchitectUIState } from './ThemeOptions/store';
import { ConfigActions } from './ThemeOptions/store/config.actions';
import { AppRoutingModule } from './app-routing.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

// BOOTSTRAP COMPONENTS
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Calendar picker
import { NgMonthPickerModule } from 'ng-month-picker';

// LAYOUT
import { BaseLayoutComponent } from './Layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './Layout/pages-layout/pages-layout.component';
import { PageTitleComponent } from './Layout/Components/page-title/page-title.component';

// HEADER
import { HeaderComponent } from './Layout/Components/header/header.component';
import { UserBoxComponent } from './Layout/Components/header/elements/user-box/user-box.component';

// SIDEBAR
import { SidebarComponent } from './Layout/Components/sidebar/sidebar.component';

// FOOTER
import { FooterComponent } from './Layout/Components/footer/footer.component';

// Dashboards
import { AnalyticsComponent } from './DemoPages/Dashboards/analytics/analytics.component';

// Pages
import { ForgotPasswordBoxedComponent } from './DemoPages/UserPages/forgot-password-boxed/forgot-password-boxed.component';
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
import { ImportBatchComponent } from './Import/batch/batch.component';
import { GiftCardComponent } from './month/giftCard/giftCard.component';
import { LastStockComponent } from './month/lastStock/lastStock.component';
import { DivisionComponent } from './Master/divisions/division.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { FileUploadModule } from 'ng2-file-upload';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [
    AppComponent,
    BaseLayoutComponent,
    PagesLayoutComponent,
    PageTitleComponent,
    HeaderComponent,
    UserBoxComponent,
    SidebarComponent,
    FooterComponent,
    AnalyticsComponent,
    ForgotPasswordBoxedComponent,
    LoginBoxedComponent,
    RegisterBoxedComponent,
    ModalsComponent,
    TooltipsPopoversComponent,
    OwnerCreateComponent,
    OwnerUpdateComponent,
    OwnerCommercialComponent,
    OwnerResidentialComponent,
    AssetCreateComponent,
    AssetUpdateComponent,
    AssetCommercialComponent,
    AssetResidentialComponent,
    PaymentComponent,
    NayanComponent,
    OrderComponent,
    TorderComponent,
    GiftCardComponent,
    LastStockComponent,
    DivisionComponent,
    ImportBatchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgReduxModule,
    CommonModule,
    LoadingBarRouterModule,
    PerfectScrollbarModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgMonthPickerModule,
    FileUploadModule,
    NgxMaskModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports:[
    NgxMaskModule
  ],
  providers: [
    {
      provide:
      PERFECT_SCROLLBAR_CONFIG,
      useValue:
      DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    ConfigActions,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(
    private ngRedux: NgRedux<ArchitectUIState>,
    private devTool: DevToolsExtension
  ) {

    this.ngRedux.configureStore(
      rootReducer,
      {} as ArchitectUIState,
      [],
      [devTool.isEnabled() ? devTool.enhancer() : f => f]
    );

  }
}
