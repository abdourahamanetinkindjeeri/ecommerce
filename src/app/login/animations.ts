import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger
} from '@angular/animations';

export const animations = [
  trigger('fadeInUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(50px)' }),
      animate('600ms cubic-bezier(0.6, -0.05, 0.01, 0.99)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ]),
  trigger('staggerItems', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(100, [
          animate('500ms ease-out',
            style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ], { optional: true })
    ])
  ]),
  trigger('float', [
    transition('* => *', [
      animate('3s ease-in-out', keyframes([
        style({ transform: 'translateY(0)', offset: 0 }),
        style({ transform: 'translateY(-10px)', offset: 0.5 }),
        style({ transform: 'translateY(0)', offset: 1 })
      ]))
    ])
  ]),
  trigger('pulse', [
    transition('* => *', [
      animate('2s ease-in-out', keyframes([
        style({ opacity: 0.5, transform: 'scale(1)', offset: 0 }),
        style({ opacity: 0.8, transform: 'scale(1.2)', offset: 0.5 }),
        style({ opacity: 0.5, transform: 'scale(1)', offset: 1 })
      ]))
    ])
  ]),
  trigger('orbAnimation', [
    transition('* => *', [
      animate('8s ease-in-out', keyframes([
        style({ transform: 'scale(1)', opacity: 0.3, offset: 0 }),
        style({ transform: 'scale(1.2)', opacity: 0.5, offset: 0.5 }),
        style({ transform: 'scale(1)', opacity: 0.3, offset: 1 })
      ]))
    ])
  ]),
  trigger('scaleIn', [
    state('normal', style({ transform: 'scale(1)' })),
    state('hovered', style({ transform: 'scale(1.05)' })),
    transition('normal <=> hovered', animate('300ms ease-out'))
  ]),
  trigger('inputFocus', [
    state('blurred', style({
      borderColor: 'rgba(255,255,255,0.1)',
      transform: 'scale(1)'
    })),
    state('focused', style({
      borderColor: '#c084fc',
      transform: 'scale(1.02)'
    })),
    transition('blurred <=> focused', animate('300ms ease-out'))
  ])
];
