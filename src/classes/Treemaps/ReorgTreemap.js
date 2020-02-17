import * as d3 from 'd3';
import { Treemap } from './Treemap';
import { getDimensions } from '../../scripts/utils';

export class ReorgTreemap extends Treemap {
  constructor(containers,data,settings) {
    super(containers,data,settings);
  }

  draw() {
    const wrapper = d3.select(this.container).select('.treemap-wrapper');
    const tContainer =  wrapper.select('.treemap-container');
    const ctrl = wrapper.append('div')
      .attr('class','treemap-ctrl')
      .lower();
    this.dimensions = getDimensions(tContainer.node()); // recalculate dims after appending controller
    this.drawController(ctrl)
    super.draw();
  }

  drawController(ctrl) {
    ctrl.selectAll('.nest-option').data(this.nestingOrder).enter()
      .append('div')
        .attr('class','nest-option')
        .text(d => d);
  }
}