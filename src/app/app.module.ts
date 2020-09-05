import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TurnOrderComponent } from './tools/turn-order/turn-order.component';
import { DiceRollComponent } from './tools/dice-roll/dice-roll.component';
import { GoldManagerComponent } from './tools/gold-manager/gold-manager.component';
import { LifeCounterComponent } from './tools/life-counter/life-counter.component';
import { RandomizerComponent } from './tools/randomizer/randomizer.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DiceRollComponent,
    GoldManagerComponent,
    LifeCounterComponent,
    RandomizerComponent,
    TurnOrderComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
