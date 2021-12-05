import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import {HttpClientModule} from '@angular/common/http'
import { ProductService } from './services/product.service';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { HelpComponent } from './components/help/help.component';


const routes: Routes = [
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'aboutus', component: AboutusComponent},
  {path: 'contactus', component: ContactusComponent},
  {path: 'help', component: HelpComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    SearchComponent,
    CartStatusComponent,
    ProductDetailsComponent,
    CartDetailsComponent,
    CheckoutComponent,
    AboutusComponent,
    ContactusComponent,
    HelpComponent,
  
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [ProductService],  
  bootstrap: [AppComponent]
})
export class AppModule { }
