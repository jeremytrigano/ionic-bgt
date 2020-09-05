import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../tools/tools.scss', './home.component.scss'],
})
export class HomeComponent implements OnInit {
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
