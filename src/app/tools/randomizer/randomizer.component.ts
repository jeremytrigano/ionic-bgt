import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-randomizer',
  templateUrl: './randomizer.component.html',
  styleUrls: ['../tools.scss', './randomizer.component.scss'],
})
export class RandomizerComponent implements OnInit {
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
