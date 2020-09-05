import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gold-manager',
  templateUrl: './gold-manager.component.html',
  styleUrls: ['../tools.scss', './gold-manager.component.scss'],
})
export class GoldManagerComponent implements OnInit {
  tool: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.tool = this.router.getCurrentNavigation().extras.state.tool;
      }
    });
  }

  ngOnInit() {}
}
