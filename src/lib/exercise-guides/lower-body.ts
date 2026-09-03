import type { ExerciseGuide } from './types';

/** Quads, hamstrings, calves, hinges and the lower-back / hip odds and ends. */
export const LOWER_BODY_GUIDES: Record<string, ExerciseGuide> = {
  // ------------------------------------------------------------------ quads
  'hack-squat': {
    setup: 'Back and hips flat against the machine pad, feet shoulder width on the platform.',
    steps: [
      'Release the safeties and lower until the knees reach about 90°, or deeper if comfortable.',
      'Drive back up through the whole foot without locking the knees hard.',
    ],
    cues: ['Feet higher on the platform favours glutes and hamstrings; lower favours quads.'],
  },
  'goblet-squat': {
    setup: 'A dumbbell or kettlebell held vertically against the chest, elbows tucked in, feet shoulder width.',
    steps: [
      'Brace and squat down between the knees until the hip crease passes the knee.',
      'Drive up through the mid-foot.',
    ],
    cues: ['The front-loaded weight keeps the torso upright — the easiest squat to learn depth with.'],
  },
  'heel-elevated-goblet-squat': {
    setup: 'As a goblet squat, with the heels on small plates or a wedge.',
    steps: ['Squat down, letting the knees travel forward.', 'Drive back up.'],
    cues: ['Raising the heels lets you reach depth with an upright torso, and hits the quads harder.'],
  },
  'smith-machine-squat': {
    setup: 'Bar on the upper back, feet slightly forward of the bar so the fixed path suits you.',
    steps: ['Unhook, descend to depth, then drive back up and re-hook at the end.'],
    cues: ['Set the foot position before the first rep — the bar path cannot adapt to you mid-set.'],
  },
  'belt-squat': {
    setup: 'A belt around the hips attached to the machine load, standing on the platform.',
    steps: ['Squat down to depth.', 'Drive back up.'],
    cues: ['Loads the legs with nothing on the spine — useful when the back is fatigued.'],
  },
  'landmine-squat': {
    setup: 'One end of a barbell in a landmine, the other end held at the chest with both hands.',
    steps: ['Squat down, letting the bar arc guide you.', 'Drive back up.'],
    cues: ['The bar path helps you counterbalance, so depth comes easily.'],
  },
  'banded-squat': {
    setup: 'Standing on a band with the other end over the shoulders, feet shoulder width.',
    steps: ['Squat to depth against the band.', 'Stand back up.'],
    cues: ['Resistance grows toward the top, so the lockout is the hardest part.'],
  },
  'bodyweight-squat': {
    setup: 'Feet shoulder width, toes slightly out, arms free for balance.',
    steps: ['Squat down until the hip crease passes the knee.', 'Drive back up through the mid-foot.'],
    cues: ['Knees track over the toes. Heels stay down.'],
  },
  'jump-squat': {
    setup: 'A bodyweight squat stance, braced.',
    steps: ['Squat to about parallel.', 'Drive up explosively into a jump.', 'Land softly and absorb straight into the next rep.'],
    cues: ['Land quietly — noise means you are not absorbing.'],
  },
  'wall-sit': {
    setup: 'Back flat against a wall, feet forward, sliding down until the knees are at 90°.',
    steps: ['Hold the position for the target time.'],
    cues: ['Thighs parallel to the floor, weight in the heels.'],
  },
  'sissy-squat': {
    setup: 'Standing tall, holding something for balance, heels allowed to rise.',
    steps: [
      'Lean the torso back and drive the knees forward, lowering toward the floor.',
      'Return by pulling with the quads.',
    ],
    cues: ['Very demanding on the knees. Start with a small range and build.'],
  },
  'pistol-squat': {
    setup: 'Standing on one leg, the other extended straight out in front.',
    steps: ['Squat down on the standing leg, keeping the free leg off the floor.', 'Drive back up.'],
    cues: ['Needs ankle mobility and balance. Build with the assisted version first.'],
  },
  'assisted-pistol-squat': {
    setup: 'On one leg, holding a rack or strap for support, the other leg extended forward.',
    steps: ['Lower on the standing leg, using the hands only as much as needed.', 'Drive back up.'],
    cues: ['Reduce the hand assistance over time until it is a true pistol.'],
  },
  'shrimp-squat': {
    setup: 'Standing on one leg, the other bent behind and held by the same-side hand.',
    steps: ['Lower until the trailing knee touches the floor.', 'Drive back up.'],
  },
  'skater-squat': {
    setup: 'Standing on one leg, the other leg trailing behind, torso hinged forward.',
    steps: ['Lower until the trailing knee lightly touches the floor or a pad.', 'Drive back up.'],
    cues: ['The forward torso lean is what distinguishes it from a pistol.'],
  },
  'cossack-squat': {
    setup: 'A wide stance, toes slightly out.',
    steps: [
      'Shift the weight over one leg and lower into a deep squat on that side, the other leg straight.',
      'Push back to centre and repeat on the other side.',
    ],
    cues: ['Keep the straight leg’s heel down and toes up if you can.'],
  },
  'forward-lunge': {
    setup: 'Standing tall, feet hip width.',
    steps: ['Step forward and lower until the back knee is just off the floor.', 'Push back to the start.'],
    cues: ['Return to the start rather than walking forward — that is what makes it a forward lunge.'],
  },
  'reverse-lunge': {
    setup: 'Standing tall, feet hip width, dumbbells optional.',
    steps: ['Step backward and lower until the back knee nearly touches.', 'Drive through the front heel to stand.'],
    cues: ['Usually kinder to the knees than a forward lunge, since the front shin stays vertical.'],
  },
  'lateral-lunge': {
    setup: 'Standing with feet together.',
    steps: [
      'Step wide to one side and sit back into that hip, the other leg staying straight.',
      'Push back to the start.',
    ],
    cues: ['Sit the hips back rather than letting the knee dive forward.'],
  },
  'dumbbell-lateral-lunge': {
    setup: 'A dumbbell held at the chest or one in each hand, feet together.',
    steps: ['Step wide and sit into that hip.', 'Push back to standing.'],
  },
  'split-squat': {
    setup: 'A staggered stance, front foot flat, back heel raised, torso upright.',
    steps: ['Lower straight down until the back knee is just off the floor.', 'Drive up through the front heel.'],
    cues: ['The feet do not move between reps — that is what separates it from a lunge.'],
  },
  'front-foot-elevated-split-squat': {
    setup: 'A split stance with the front foot on a small plate or step.',
    steps: ['Lower straight down.', 'Drive back up through the front heel.'],
    cues: ['The elevation increases the stretch on the front leg at the bottom.'],
  },
  'smith-machine-split-squat': {
    setup: 'Bar on the upper back in the Smith machine, feet in a split stance under it.',
    steps: ['Lower straight down.', 'Drive back up.'],
    cues: ['The fixed path removes the balance demand, so you can push the load.'],
  },
  'smith-machine-bulgarian-split-squat': {
    setup: 'Rear foot on a bench behind you, bar on the upper back in the Smith machine.',
    steps: ['Lower until the back knee is just off the floor.', 'Drive up through the front heel.'],
  },
  'smith-machine-reverse-lunge': {
    setup: 'Bar on the upper back in the Smith machine, standing under it.',
    steps: ['Step one foot back and lower.', 'Drive back to the start, then alternate.'],
  },
  'step-up': {
    setup: 'Facing a box or bench at about knee height, dumbbells optional.',
    steps: [
      'Place one whole foot on the box.',
      'Drive through that heel to stand up, without pushing off the trailing foot.',
      'Lower under control and repeat.',
    ],
    cues: ['If you are bouncing off the back foot, lower the box.'],
  },
  'step-down': {
    setup: 'Standing on a box on one leg, the other foot hanging off the side.',
    steps: ['Lower slowly until the free heel taps the floor.', 'Drive back up on the standing leg.'],
    cues: ['A control exercise — the slow lowering is the point.'],
  },
  'single-leg-box-squat': {
    setup: 'Standing on one leg in front of a box, the other leg extended forward.',
    steps: ['Sit back and down until you touch the box.', 'Stand back up without rocking.'],
    cues: ['Touch the box, do not slump onto it.'],
  },
  'standing-quad-stretch': {
    setup: 'Standing on one leg, holding something for balance.',
    steps: ['Pull the other heel toward the glute, knees together.', 'Hold, then swap sides.'],
    cues: ['Keep the hips square and the knees side by side.'],
  },

  // ------------------------------------------------------------- hamstrings
  'good-morning': {
    setup: 'Bar on the upper back, feet hip width, knees softly bent.',
    steps: [
      'Push the hips backward, letting the torso fold forward with a flat back.',
      'Stop when the hamstrings are stretched, then drive the hips forward to stand.',
    ],
    cues: ['Go lighter than feels necessary. A rounding back means stop.'],
  },
  'dumbbell-romanian-deadlift': {
    setup: 'A dumbbell in each hand in front of the thighs, knees softly bent.',
    steps: ['Push the hips back, sliding the dumbbells down the legs.', 'Drive the hips forward to stand.'],
    cues: ['Range is set by your hamstrings, not by touching the floor.'],
  },
  'kettlebell-romanian-deadlift': {
    setup: 'A kettlebell in both hands in front of the thighs, knees softly bent.',
    steps: ['Hinge the hips back with a flat back.', 'Stand by driving the hips forward.'],
  },
  'smith-machine-romanian-deadlift': {
    setup: 'Bar at hip height in the Smith machine, gripped in front of the thighs.',
    steps: ['Hinge the hips back, sliding the bar down the legs.', 'Drive the hips forward to stand.'],
  },
  'landmine-romanian-deadlift': {
    setup: 'One end of a barbell in a landmine, the other end held in both hands.',
    steps: ['Hinge the hips back.', 'Drive the hips forward to stand.'],
  },
  'single-leg-romanian-deadlift': {
    setup: 'Standing on one leg, a dumbbell in the opposite hand.',
    steps: [
      'Hinge at the hip, letting the free leg travel straight back as a counterweight.',
      'Stop when the hamstring is stretched, then return to standing.',
    ],
    cues: ['Hips stay square to the floor — the free hip wants to open upward.'],
  },
  'nordic-hamstring-curl': {
    setup: 'Kneeling with the ankles anchored under something solid, torso upright.',
    steps: [
      'Lower the torso toward the floor as slowly as possible, keeping the hips extended.',
      'Catch with the hands and push back up to the start.',
    ],
    cues: ['Extremely demanding. Start with a small range or band assistance, and expect soreness.'],
  },
  'lying-hamstring-walkout': {
    setup: 'On your back with the knees bent, heels on the floor, hips lifted.',
    steps: ['Walk the heels out until the legs are nearly straight, keeping the hips up.', 'Walk them back in.'],
    cues: ['Hips stay up throughout — dropping them ends the set.'],
  },
  'towel-hamstring-curl': {
    setup: 'On your back on a smooth floor, heels on towels, hips lifted.',
    steps: ['Slide the heels out until the legs are nearly straight.', 'Drag them back in with the hamstrings.'],
  },
  'stability-ball-hamstring-curl': {
    setup: 'On your back with the heels on a stability ball, hips lifted.',
    steps: ['Roll the ball out until the legs are nearly straight.', 'Curl it back in with the heels.'],
    cues: ['Keep the hips high — letting them sag makes it much easier.'],
  },
  'hamstring-stretch': {
    setup: 'Seated or standing with one leg straight in front, toes up.',
    steps: ['Hinge at the hips toward the straight leg until you feel a stretch.', 'Hold, then swap.'],
    cues: ['Hinge from the hips, not by rounding the back.'],
  },
  'seated-forward-fold-stretch': {
    setup: 'Seated with both legs straight out in front.',
    steps: ['Hinge forward from the hips, reaching toward the feet.', 'Hold and breathe.'],
  },

  // ----------------------------------------------------------------- calves
  'calf-raise': {
    setup: 'Standing, balls of the feet on the floor or the edge of a step.',
    steps: ['Rise onto the toes as high as possible.', 'Pause, then lower slowly.'],
    cues: ['A full stretch at the bottom matters as much as the squeeze at the top.'],
  },
  'single-leg-calf-raise': {
    setup: 'Standing on one foot, holding something for balance.',
    steps: ['Rise onto the toes.', 'Pause, then lower slowly. Finish the side before swapping.'],
  },
  'donkey-calf-raise': {
    setup: 'Hinged forward at the hips with the balls of the feet on a platform, pad across the hips.',
    steps: ['Let the heels drop for a stretch.', 'Rise onto the toes, pause, and lower slowly.'],
    cues: ['The bent-over position gives the calves a strong stretch under load.'],
  },
  'leg-press-calf-raise': {
    setup: 'In the leg press with only the balls of the feet on the bottom of the platform, legs nearly straight.',
    steps: ['Let the platform push the toes back for a stretch.', 'Press through the toes, then lower slowly.'],
    cues: ['Keep the safeties engaged — the platform is held by your calves alone.'],
  },
  'jump-rope': {
    setup: 'Rope handles at hip height, elbows close to the body, standing tall.',
    steps: ['Turn the rope with the wrists and hop just high enough to clear it.'],
    cues: ['Small hops. The wrists do the turning, not the arms.'],
  },
  'fast-feet': {
    setup: 'Athletic stance, knees soft, weight on the balls of the feet.',
    steps: ['Run the feet in place as quickly as possible for the target time.'],
    cues: ['Stay low and quick rather than lifting the knees high.'],
  },
  'wall-calf-stretch': {
    setup: 'Hands on a wall, one foot back with the heel down and the leg straight.',
    steps: ['Lean forward until you feel a stretch in the calf.', 'Hold, then swap sides.'],
    cues: ['Bend the back knee slightly to shift the stretch to the lower calf.'],
  },

  // -------------------------------------------------------- posterior chain
  'sumo-deadlift': {
    setup: 'A wide stance with the toes turned out, hands gripping inside the knees.',
    steps: [
      'Drop the hips, chest up, back flat, and take the slack out of the bar.',
      'Push the floor apart with the feet and stand.',
      'Return by hinging the hips back.',
    ],
    cues: ['More upright torso and more leg drive than a conventional pull. Hips start lower.'],
  },
  'trap-bar-deadlift': {
    setup: 'Standing inside a trap bar, feet hip width, gripping the neutral handles.',
    steps: ['Drop the hips, brace, and stand by driving the floor away.', 'Return by hinging the hips back.'],
    cues: ['The neutral grip and centred load make this the most back-friendly deadlift variant.'],
  },
  'dumbbell-sumo-deadlift': {
    setup: 'A wide stance with a dumbbell held vertically between the feet.',
    steps: ['Hinge and drop the hips to grip it, then stand tall.', 'Lower under control.'],
  },

  // --------------------------------------------------------------- adductors
  'hip-adduction-machine': {
    setup: 'Seated with the pads against the inside of the thighs, legs apart.',
    steps: ['Squeeze the legs together against the pads.', 'Return under control to a stretch.'],
    cues: ['Control the return — letting the legs fly apart is how adductors get strained.'],
  },
  'cable-standing-hip-adduction': {
    setup: 'A cuff on the inside ankle, standing side-on to a low pulley, holding the frame.',
    steps: ['Pull the working leg across the body against the cable.', 'Return under control, then swap.'],
  },

  // -------------------------------------------------------------------- hips
  'kneeling-hip-flexor-stretch': {
    setup: 'Half kneeling, one knee down, the other foot forward and flat.',
    steps: [
      'Tuck the pelvis under and squeeze the glute on the kneeling side.',
      'Shift gently forward until you feel a stretch at the front of the hip. Hold, then swap.',
    ],
    cues: ['The pelvic tuck is what makes this work — leaning forward without it just arches the back.'],
  },
  'butterfly-stretch': {
    setup: 'Seated with the soles of the feet together, knees out to the sides.',
    steps: ['Hold the feet and let the knees settle toward the floor.', 'Hold and breathe.'],
    cues: ['Do not push the knees down with force — let them fall.'],
  },

  // -------------------------------------------------------------- lower back
  'back-extension': {
    setup: 'Hips on the pad of a back-extension bench, ankles secured, torso hanging down.',
    steps: ['Raise the torso until the body is in one straight line.', 'Lower under control.'],
    cues: ['Stop at straight. Arching past that grinds the lower back for no benefit.'],
  },
  superman: {
    setup: 'Face down on the floor, arms extended overhead.',
    steps: ['Raise the arms, chest and legs off the floor together.', 'Lower under control.'],
    cues: ['A small lift is enough — this is not about height.'],
  },
  'superman-hold': {
    setup: 'Face down, arms extended overhead.',
    steps: ['Raise the arms, chest and legs and hold for the target time.'],
    cues: ['Breathe normally throughout rather than holding your breath.'],
  },
};
