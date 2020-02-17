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
    this.drawController(ctrl);
    super.draw();
  }

  drawController(ctrl) { // enables drag
    ctrl.selectAll('.nest-option').data(this.nestingOrder).enter()
      .append('div')
        .attr('class','nest-option')
        .text(d => d)
        .call(this.enableDrag);
  }

  enableDrag = (sel) => {
    let evt, rest;
    const self = this;
    const reset = (sel) => { 
      sel.attr('style',null)
        .style('position','relative')
    };
    sel.call(
      d3.drag()
        .subject(d => sel.filter(dt => dt === d))
        .on('start',function(d) { 
          rest = sel.filter(dt => dt !== d);
         })
        .on('drag',function() { // TODO: set a "snapped" status to animate elements?
          evt = d3.event;
          evt.subject
            .style('position','absolute')
            .style('left',evt.x + 'px')
            .style('top',evt.y + 'px');
        })
        .on('end',function() {
          const node = evt.subject.node()
          const { left } = node.getBoundingClientRect();
          const nodes = rest.nodes();

          if(left > nodes[nodes.length -1].getBoundingClientRect().left) {
            evt.subject.call(reset);
            return;
          }

          for(let e of nodes) {
            let rect = e.getBoundingClientRect()
            if(left < rect.left) {
              console.log('Left to ', e);
              node.parentElement.insertBefore(node,e);
              evt.subject.call(reset);
              break;
            }
          }
          
        })
    )
  }
}