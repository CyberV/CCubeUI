declare var $;


export function scrollToBottom() {
  let cont = $('.container');
  cont[cont.length - 1].scrollTop = 2000;
}

export function scrollToTop() {
  let cont = $('.container');
  cont[cont.length - 1].scrollTop = 0;
}

export function prettyDate(date) {
  return new Date(date).toString().split(' ').slice(1, 3).join(' ');
}

export function scrollElementToTop(emt) {
  let inp: any = emt;

  if (inp) {
    
    try {
      inp.focus();
    } catch (e) {

    }

    let cont = $('.container');

    let top = cont[cont.length - 1].scrollTop,
      emtTop = $(inp).offset().top;



    if (cont.length && emtTop > top) {
      let c = cont[cont.length - 1];

      if (top != 0) {
        c.scrollTop = $(inp).offset().top - 70;
        console.log('Current Top', top, 'emt top', emtTop);
      } else {
        c.scrollTop = $(inp).offset().top;
        console.log('Current Top', top, 'emt top', emtTop);
        //inp.scrollIntoView({behavior:'smooth', block:'start'})
      }




    } else if (emt.className.indexOf('plan-slider') > -1) {
      let c = cont[cont.length - 1];
      c.scrollTop = 800;
    } 
  }
}
