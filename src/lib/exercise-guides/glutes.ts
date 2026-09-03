import type { ExerciseGuide } from './types';

/** Glute and hip work, including the banded accessory movements. */
export const GLUTE_GUIDES: Record<string, ExerciseGuide> = {
  'hip-thrust': {
    setup:
      'Upper back against a bench, feet flat and about shoulder width, bar across the hips with a pad.',
    steps: [
      'Tuck the chin and brace the core.',
      'Drive through the heels to lift the hips until the torso is parallel to the floor.',
      'Squeeze the glutes hard at the top, then lower under control.',
    ],
    cues: [
      'Stop at parallel. Going higher arches the lower back rather than working the glutes.',
      'Shins vertical at the top — if they angle forward, walk the feet in.',
    ],
  },
  'barbell-glute-bridge': {
    setup: 'Lying on the floor with a padded bar across the hips, feet flat.',
    steps: ['Drive the hips up until the body forms a line from knees to shoulders.', 'Lower under control.'],
    cues: ['Shorter range than a hip thrust because the back starts on the floor.'],
  },
  'dumbbell-hip-thrust': {
    setup: 'Upper back on a bench, a dumbbell held across the hips.',
    steps: ['Drive the hips up to parallel.', 'Squeeze, then lower under control.'],
  },
  'smith-machine-hip-thrust': {
    setup: 'Upper back on a bench positioned under the Smith bar, bar padded across the hips.',
    steps: ['Unhook, drive the hips to parallel, then lower under control.'],
    cues: ['The fixed path makes it easy to load heavy without balancing the bar.'],
  },
  'glute-bridge': {
    setup: 'On your back, knees bent, feet flat and close to the glutes, arms at your sides.',
    steps: ['Drive through the heels to lift the hips into a straight line.', 'Squeeze, then lower.'],
    cues: ['Push through the heels, not the toes.'],
  },
  'dumbbell-glute-bridge': {
    setup: 'A glute bridge position with a dumbbell held across the hips.',
    steps: ['Drive the hips up.', 'Squeeze, then lower under control.'],
  },
  'single-leg-glute-bridge': {
    setup: 'On your back with one foot flat, the other leg extended or knee pulled to the chest.',
    steps: ['Drive through the planted heel to lift the hips.', 'Lower under control, then swap.'],
    cues: ['Keep the hips level — the unsupported side wants to drop.'],
  },
  'banded-glute-bridge': {
    setup: 'A glute bridge position with a loop band just above the knees.',
    steps: ['Drive the hips up while pressing the knees out against the band.', 'Lower under control.'],
  },
  'banded-hip-thrust': {
    setup: 'Upper back on a bench with a loop band above the knees.',
    steps: ['Drive the hips to parallel, pressing the knees out against the band.', 'Lower under control.'],
  },
  'glute-bridge-march': {
    setup: 'Hips already lifted in a glute bridge.',
    steps: ['Without letting the hips drop or tilt, lift one knee toward the chest.', 'Lower it and alternate.'],
    cues: ['The hips staying level is the exercise — if they rock, slow down.'],
  },
  'frog-pump': {
    setup: 'On your back with the soles of the feet together and knees out to the sides.',
    steps: ['Drive the hips up by squeezing the glutes.', 'Lower under control.'],
    cues: ['The turned-out position takes the quads out of it almost entirely.'],
  },
  'banded-frog-pump': {
    setup: 'A frog pump position with a loop band above the knees.',
    steps: ['Drive the hips up against the band.', 'Lower under control.'],
  },
  'cable-pull-through': {
    setup: 'Facing away from a low pulley, rope passed between the legs, held in both hands.',
    steps: [
      'Hinge the hips back, letting the rope travel between the legs.',
      'Drive the hips forward to stand tall and squeeze the glutes.',
    ],
    cues: ['It is a hip hinge, not a squat, and not a lift with the arms.'],
  },
  'cable-kickback': {
    setup: 'A cuff on one ankle, facing a low pulley, holding the frame for balance.',
    steps: ['Drive the working leg straight back, squeezing the glute.', 'Return under control, then swap.'],
    cues: ['Do not arch the lower back to get more range.'],
  },
  'machine-glute-kickback': {
    setup: 'Positioned in the machine with the working foot against the pad.',
    steps: ['Press the pad back until the hip is extended.', 'Return under control.'],
  },
  'banded-kickback': {
    setup: 'A band around the ankles, on all fours or standing.',
    steps: ['Drive one leg back against the band.', 'Return under control, then swap.'],
  },
  'banded-donkey-kick': {
    setup: 'On all fours with a band looped around one foot and held under the hands.',
    steps: ['Drive the banded foot up and back, knee bent to 90°.', 'Lower under control.'],
    cues: ['Keep the hips square to the floor.'],
  },
  'donkey-kick': {
    setup: 'On all fours, hands under the shoulders, knees under the hips.',
    steps: ['Drive one heel up toward the ceiling, keeping the knee bent.', 'Lower under control and swap.'],
    cues: ['Squeeze the glute at the top rather than arching the back.'],
  },
  'fire-hydrant': {
    setup: 'On all fours, knees under the hips.',
    steps: ['Lift one knee out to the side, keeping it bent.', 'Lower under control and swap.'],
    cues: ['The torso stays square — do not roll onto the opposite hip.'],
  },
  'banded-fire-hydrant': {
    setup: 'On all fours with a loop band above the knees.',
    steps: ['Lift one knee out to the side against the band.', 'Lower under control.'],
  },
  clamshell: {
    setup: 'Lying on one side, knees bent to about 45°, feet together, hips stacked.',
    steps: ['Keeping the feet touching, open the top knee upward.', 'Lower under control, then swap sides.'],
    cues: ['Do not let the top hip roll backward — that is how people fake the range.'],
  },
  'banded-clamshell': {
    setup: 'A clamshell position with a loop band above the knees.',
    steps: ['Open the top knee against the band.', 'Lower under control.'],
  },
  'side-lying-hip-abduction': {
    setup: 'Lying on one side with the legs straight and stacked.',
    steps: ['Raise the top leg toward the ceiling.', 'Lower under control, then swap.'],
    cues: ['Lead with the heel, not the toes, to keep the glute working.'],
  },
  'side-lying-leg-raise': {
    setup: 'Lying on one side, body in a straight line.',
    steps: ['Raise the top leg as high as it will go without the hips rolling.', 'Lower under control.'],
  },
  'hip-abduction-machine': {
    setup: 'Seated with the pads against the outside of the thighs, knees together.',
    steps: ['Press the knees apart against the pads.', 'Return under control.'],
    cues: ['Leaning the torso forward slightly biases the upper glute.'],
  },
  'cable-standing-hip-abduction': {
    setup: 'A cuff on the outside ankle, standing side-on to a low pulley.',
    steps: ['Lift the working leg out to the side against the cable.', 'Return under control, then swap.'],
  },
  'banded-standing-hip-abduction': {
    setup: 'A loop band around the ankles, standing tall and holding something for balance.',
    steps: ['Lift one leg out to the side against the band.', 'Return under control.'],
  },
  'banded-seated-hip-abduction': {
    setup: 'Seated on a bench with a loop band above the knees, feet flat.',
    steps: ['Press the knees apart against the band.', 'Return under control.'],
  },
  'banded-lateral-walk': {
    setup: 'A loop band above the knees or around the ankles, in a quarter-squat stance.',
    steps: ['Step sideways, keeping tension in the band the whole way.', 'Take the target steps, then reverse direction.'],
    cues: ['Stay low and keep the feet from clicking together between steps.'],
  },
  'banded-monster-walk': {
    setup: 'A loop band around the ankles, in a quarter-squat stance.',
    steps: ['Walk forward with wide, deliberate steps against the band.', 'Then walk backward the same way.'],
    cues: ['Keep the feet wide — letting them drift narrow kills the tension.'],
  },
  'curtsy-lunge': {
    setup: 'Standing tall, feet hip width.',
    steps: [
      'Step one leg diagonally behind and across the other, lowering into a lunge.',
      'Drive back to standing, then alternate.',
    ],
    cues: ['The crossing step biases the glute medius. Keep the front knee tracking over the foot.'],
  },
  'dumbbell-curtsy-lunge': {
    setup: 'Dumbbells at your sides or one at the chest, feet hip width.',
    steps: ['Step diagonally behind and across, lowering into the lunge.', 'Drive back to standing.'],
  },
  'deficit-reverse-lunge': {
    setup: 'Standing on a low platform or plate, dumbbells optional.',
    steps: ['Step back off the platform and lower until the back knee nearly touches.', 'Drive back up.'],
    cues: ['The deficit adds range at the hip, which is where the extra glute work comes from.'],
  },
  'dumbbell-sumo-squat': {
    setup: 'A wide stance with the toes turned out, a dumbbell held vertically between the legs.',
    steps: ['Squat down between the knees, keeping the torso upright.', 'Drive back up, squeezing the glutes.'],
    cues: ['Push the knees out in line with the toes throughout.'],
  },
  'kettlebell-swing': {
    setup: 'Kettlebell on the floor a foot in front of you, feet shoulder width, hinged forward gripping it.',
    steps: [
      'Hike the bell back between the legs like a rugby pass.',
      'Snap the hips forward explosively to float the bell to chest height.',
      'Let it fall back down and hinge into the next rep.',
    ],
    cues: [
      'The hips throw the bell — the arms are just rope. Lifting it with the shoulders is the classic mistake.',
      'It is a hinge, not a squat.',
    ],
  },
  'glute-focused-back-extension': {
    setup: 'On a back-extension bench with the pad low on the thighs, feet turned slightly out.',
    steps: [
      'Round the upper back slightly and tuck the pelvis.',
      'Raise the torso by squeezing the glutes, stopping at a straight line.',
      'Lower under control.',
    ],
    cues: ['The deliberate rounding is what shifts the work from the lower back to the glutes.'],
  },
  'reverse-hyperextension': {
    setup: 'Torso on the machine pad, hips at the edge, legs hanging down.',
    steps: ['Raise the legs behind you until the body is in a straight line.', 'Lower under control.'],
    cues: ['Stop at straight rather than swinging the legs high.'],
  },
  'hip-airplane': {
    setup: 'Standing on one leg, hinged forward, the other leg extended straight behind.',
    steps: [
      'Rotate the hips open toward the free-leg side, then rotate back closed.',
      'Keep the standing knee soft and the torso in line with the free leg.',
    ],
    cues: ['A balance and hip-control drill. Hold a wall until it is steady.'],
  },
};
