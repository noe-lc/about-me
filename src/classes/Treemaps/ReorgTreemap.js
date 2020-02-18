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
    let subject, clone, rest, wTransition = false;
    let initL, initR;
    const reset = (subject,wTransition) => { 
      subject.attr('style',null)
        .style('position','relative');
      if(wTransition) {
        clone.transition()
          .duration(750)
          .style('padding',0)
          .style('width','0px')
          .remove();
        return;
      }
      clone.remove();
    };
    const reInsert = (refNode,node,before = true) => {
      refNode.parentElement.insertBefore(refNode,before ? node : node.nextElementSibling);
    };

    sel.call(
      d3.drag()
        .subject(d => sel.filter(dt => dt === d))
        .on('start',function(d) {
          subject = d3.event.subject;
          rest = sel.filter(dt => dt !== d);
          ({ left: initL, right: initR } = this.getBoundingClientRect());
          initL += 10; // tolerance 
          initR += 10;
          clone = subject.clone(true)
            .classed('clone',true)
            .datum(null);
         })
        .on('drag',function() { // TODO: set a "snapped" status to animate elements?
          subject
            .style('position','absolute')
            .style('left',d3.event.x - (parseInt(subject.style('width')) / 2) + 'px');
        })
        .on('end',function() {
          const nodes = rest.nodes(),
            lastRect = nodes[nodes.length - 1].getBoundingClientRect(),
            isLast = this.isSameNode(nodes[nodes.length -1]),
            { left, right } = this.getBoundingClientRect();

          const compare = () => {
            if(!isLast && left > lastRect.right) { // moved to last position
              this.parentElement.appendChild(this);
              wTransition = true;
            } else if(!(isLast && left > lastRect.left)) { // in between and all other previous
              for(let n of nodes) {
                let rect = n.getBoundingClientRect();
                if(left < rect.left) {
                  reInsert(this,n);
                  wTransition = true;
                  break;
                } else if(left > rect.right) {
                  reInsert(this,n,false);
                  wTransition = true;
                  break;
                }
              }
            }
          };
          
          if(left > initR || right < initL) { // moved beyond previous
            compare();
          }

          reset(d3.event.subject,wTransition);
          sel = d3.select(this.parentElement).selectAll('.nest-option') // reassign selection after reordering
            .filter(d => d);
          wTransition = false;
        })
    )
  }
}