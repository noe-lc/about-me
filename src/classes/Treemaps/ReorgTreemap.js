import * as d3 from 'd3';
import { Treemap } from './Treemap';

export class ReorgTreemap extends Treemap {
  constructor(containers,data,settings) {
    super(containers,data,settings);
  }

  draw() {
    const wrapper = d3.select(this.container).select('.treemap-wrapper');
    wrapper.append('div')
      .attr('class','treemap-controller')
      .lower();
    wrapper.select('treemap-container')
      .style('height','90%');
    super.draw();

  }
}