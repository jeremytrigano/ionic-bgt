import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TurnOrderComponent } from './tools/turn-order/turn-order.component';
import { HomeComponent } from './home/home.component';
import { DiceRollComponent } from './tools/dice-roll/dice-roll.component';
import { GoldManagerComponent } from './tools/gold-manager/gold-manager.component';
import { RandomizerComponent } from './tools/randomizer/randomizer.component';
import { LifeCounterComponent } from './tools/life-counter/life-counter.component';

const routes: Routes = [
  {
    path: 'dice-roll',
    component: DiceRollComponent,
  },
  {
    path: 'gold-manager',
    component: GoldManagerComponent,
  },
  {
    path: 'life-counter',
    component: LifeCounterComponent,
  },
  {
    path: 'randomizer',
    component: RandomizerComponent,
  },
  {
    path: 'turn-order',
    component: TurnOrderComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
