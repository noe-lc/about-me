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
    let evt, rest, isLast = false;
    const self = this;

    const reset = (sel) => { 
      sel.attr('style',null)
        .transition()
        .duration(250)
        .style('position','relative')
    };
    const reInsert = (refNode,node,before = true) => {
      console.log('node.nextElementSibling :', node.nextElementSibling);
      refNode.parentElement.insertBefore(refNode,before ? node : node.nextElementSibling);
    };

    sel.call(
      d3.drag()
        .subject(d => sel.filter(dt => dt === d))
        .on('start',function(d,_,nodes) { 
          rest = sel.filter(dt => dt !== d);
          isLast = this.isSameNode(nodes[nodes.length -1]);
         })
        .on('drag',function() { // TODO: set a "snapped" status to animate elements?
          evt = d3.event;
          evt.subject
            .style('position','absolute')
            .style('left',evt.x + 'px')
            //.style('top',evt.y + 'px');
        })
        .on('end',function() {
          const evtNode = evt.subject.node();
          const nodes = rest.nodes();
          const lastRect = nodes[nodes.length - 1].getBoundingClientRect();
          const { left } = evtNode.getBoundingClientRect();
          
          if(isLast && left > lastRect.left) { // no change from last position
            evt.subject.call(reset);
          } else if(!isLast && left > lastRect.right) { // moved to last position
            evtNode.parentElement.appendChild(evtNode);
            evt.subject.call(reset);
          } else { // in between and all other previous
            for(let n of nodes) {
              let rect = n.getBoundingClientRect()
              if(left < rect.left) {
                reInsert(evtNode,n);
                evt.subject.call(reset);
                break;
              } else if(left > rect.right) {
                reInsert(evtNode,n,false);
                evt.subject.call(reset);
                break;
              }
            }
          }
          sel = d3.select(evtNode.parentElement).selectAll('.nest-option'); // reassign selection after reordering
          isLast = false;
          
        })
    )
  }
}