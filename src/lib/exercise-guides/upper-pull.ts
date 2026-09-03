import type { ExerciseGuide } from './types';

/** Back, lat, bicep, upper-back and forearm work beyond the routine lifts. */
export const UPPER_PULL_GUIDES: Record<string, ExerciseGuide> = {
  // ------------------------------------------------------------------- back
  't-bar-row': {
    setup:
      'Straddle the bar with a chest pad or hinged forward at about 45°, handles gripped, back flat.',
    steps: [
      'Brace and row the handles toward the lower chest.',
      'Squeeze the shoulder blades together at the top.',
      'Lower under control to a full stretch.',
    ],
    cues: ['The torso angle stays fixed — if you are standing up to move it, go lighter.'],
  },
  'dumbbell-bent-over-row': {
    setup: 'Hinged forward to about 45°, knees soft, a dumbbell in each hand hanging below the chest.',
    steps: ['Row both dumbbells to the lower ribs, elbows driving back.', 'Lower to a full stretch.'],
    cues: ['Lead with the elbows, not the hands.'],
  },
  'one-arm-dumbbell-row': {
    setup:
      'One knee and one hand on a bench, the other foot on the floor, back flat and parallel to the ground.',
    steps: [
      'Let the dumbbell hang and the shoulder blade stretch forward.',
      'Row the dumbbell to the hip, elbow close to the body.',
      'Lower under control, then finish the side before swapping.',
    ],
    cues: ['Do not twist the torso to lift more — the shoulders stay square to the floor.'],
  },
  'chest-supported-row': {
    setup: 'Face down on an incline bench with the chest against the pad, arms hanging.',
    steps: ['Row the weight to the ribs.', 'Lower to a full stretch.'],
    cues: ['The pad removes the lower back from the equation, which is the whole point of this variation.'],
  },
  'machine-row': {
    setup: 'Seated with the chest against the pad, feet planted, handles at arm’s length.',
    steps: ['Pull the handles back, driving the elbows past the torso.', 'Return under control.'],
  },
  'pendlay-row': {
    setup: 'Torso parallel to the floor, bar resting on the ground, grip just outside the knees.',
    steps: [
      'Brace hard, then row the bar explosively to the lower chest.',
      'Return it all the way to the floor and reset before the next rep.',
    ],
    cues: ['Every rep starts dead from the floor — that reset is what separates it from a barbell row.'],
  },
  'inverted-row': {
    setup: 'Under a bar set at hip height, hanging with a straight body and heels on the floor.',
    steps: ['Pull the chest to the bar, squeezing the shoulder blades.', 'Lower to a full hang.'],
    cues: ['Lower the bar or elevate the feet to make it harder; raise the bar to make it easier.'],
  },
  'meadows-row': {
    setup: 'One end of a barbell in a landmine, standing side-on, hinged forward, gripping the sleeve end.',
    steps: ['Row the bar end up toward the hip.', 'Lower to a full stretch, then swap sides.'],
    cues: ['The angled bar path gives a longer stretch than a straight dumbbell row.'],
  },
  'single-arm-cable-row': {
    setup: 'Seated or standing at a cable, one handle, arm extended and shoulder allowed to reach forward.',
    steps: ['Pull the handle to the ribs, rotating the torso slightly.', 'Return to a full stretch.'],
    cues: ['Let the shoulder blade travel — the extra range is why you row one arm at a time.'],
  },
  'rack-pull': {
    setup: 'Bar set on rack pins at or just below the knee, gripped as for a deadlift.',
    steps: [
      'Brace, take the slack out, and drive the hips forward to lock out.',
      'Lower back to the pins under control.',
    ],
    cues: ['A partial deadlift for the top half. Heavy loads are normal here — the back still has to stay flat.'],
  },
  'doorway-row': {
    setup: 'Both hands gripping a doorframe, feet close to it, leaning back with straight arms.',
    steps: ['Pull yourself upright toward the frame.', 'Lower back to a lean.'],
    cues: ['A rowing option with no equipment — walk the feet forward to make it harder.'],
  },
  'towel-row': {
    setup: 'A towel looped around a sturdy anchor, one end in each hand, leaning back.',
    steps: ['Pull yourself in toward the anchor.', 'Lower under control.'],
  },
  'banded-row': {
    setup: 'A band anchored in front at chest height, one end in each hand, arms extended.',
    steps: ['Pull the band to the ribs, elbows back.', 'Return under control.'],
    cues: ['Step back to increase tension.'],
  },
  rowing: {
    setup: 'Feet strapped in, shins vertical, arms straight, shoulders in front of the hips.',
    steps: [
      'Drive with the legs first, keeping the arms straight.',
      'Once the legs are nearly straight, swing the torso back slightly.',
      'Finish by pulling the handle to the lower ribs.',
      'Reverse the order on the recovery: arms, then torso, then legs.',
    ],
    cues: ['Legs–body–arms out, arms–body–legs back. Pulling with the arms first is the classic error.'],
  },
  swimming: {
    setup: 'In the water, body long and horizontal.',
    steps: ['Swim at a steady effort for the target time or distance.'],
    cues: ['Log it as duration or distance — the app tracks whichever the exercise type asks for.'],
  },
  skierg: {
    setup: 'Standing at the machine, handles overhead, feet hip width.',
    steps: [
      'Hinge at the hips and pull the handles down past the thighs.',
      'Stand back up and return the handles overhead.',
    ],
    cues: ['The power comes from the hip hinge and the lats, not the arms.'],
  },
  'childs-pose': {
    setup: 'Kneeling with the big toes together and knees apart, sitting back onto the heels.',
    steps: ['Walk the hands forward and let the chest sink toward the floor.', 'Hold and breathe.'],
    cues: ['A rest and decompression position, not a strength exercise.'],
  },

  // ------------------------------------------------------------------- lats
  'assisted-pull-up': {
    setup: 'Knees on the assist pad, overhand grip slightly wider than the shoulders.',
    steps: ['Pull until the chin clears the bar.', 'Lower to a full hang under control.'],
    cues: ['More weight on the stack means more assistance — reduce it over time.'],
  },
  'wide-grip-lat-pulldown': {
    setup: 'Thighs under the pad, hands well outside shoulder width.',
    steps: ['Pull the bar to the upper chest, elbows driving down.', 'Return to a full stretch.'],
    cues: ['Wider grip biases the upper lats, at the cost of some range.'],
  },
  'neutral-grip-pull-up': {
    setup: 'Hanging from parallel handles, palms facing each other.',
    steps: ['Pull until the chin clears the handles.', 'Lower to a full hang.'],
    cues: ['Usually the most shoulder- and elbow-friendly pull-up grip.'],
  },
  'active-hang': {
    setup: 'Hanging from a bar with straight arms.',
    steps: [
      'From a dead hang, pull the shoulder blades down and back without bending the elbows.',
      'Hold, then release back to a passive hang.',
    ],
    cues: ['This is the starting position of every good pull-up — worth training on its own.'],
  },
  'scapular-pull-up': {
    setup: 'Hanging from a bar, arms straight.',
    steps: ['Depress the shoulder blades to raise the body an inch or two, arms staying straight.', 'Lower back to a full hang.'],
    cues: ['Tiny range. If the elbows bend, it has become a pull-up.'],
  },
  'negative-pull-up': {
    setup: 'Chin already over the bar, from a jump or a box.',
    steps: ['Lower yourself as slowly as you can to a full hang.', 'Reset to the top and repeat.'],
    cues: ['Aim for three to five seconds down. The best way in if you cannot yet do a full pull-up.'],
  },
  'commando-pull-up': {
    setup: 'Standing under the bar side-on, hands gripping it one in front of the other.',
    steps: ['Pull up so the head passes to one side of the bar.', 'Lower, then alternate sides.'],
  },
  'l-sit-pull-up': {
    setup: 'Hanging from the bar with the legs held straight out in front at hip height.',
    steps: ['Hold the L, then pull until the chin clears the bar.', 'Lower without letting the legs drop.'],
    cues: ['The legs staying up is the hard part — if they sag, do regular pull-ups and train the L-sit separately.'],
  },
  'towel-pull-up': {
    setup: 'Two towels over the bar, one gripped in each hand.',
    steps: ['Pull until the hands reach bar height.', 'Lower under control.'],
    cues: ['Brutal on the grip — that is the point. Expect fewer reps than a bar pull-up.'],
  },
  'banded-lat-pulldown': {
    setup: 'A band anchored overhead, one end in each hand, arms extended, kneeling or seated.',
    steps: ['Pull the band down to the upper chest.', 'Return under control.'],
  },

  // ----------------------------------------------------------------- biceps
  'chin-up': {
    setup: 'Hanging from the bar with an underhand grip about shoulder width.',
    steps: ['Pull until the chin clears the bar, elbows driving down.', 'Lower to a full hang.'],
    cues: ['The supinated grip brings the biceps in far more than a pull-up.'],
  },
  'assisted-chin-up': {
    setup: 'Knees on the assist pad, underhand grip.',
    steps: ['Pull until the chin clears the bar.', 'Lower under control.'],
  },
  'weighted-chin-up': {
    setup: 'Dip belt or a dumbbell between the feet, underhand grip.',
    steps: ['Pull until the chin clears the bar.', 'Lower under control.'],
  },
  'preacher-curl': {
    setup: 'Upper arms flat on the preacher pad, arms extended but not locked hard.',
    steps: ['Curl the weight up to shoulder height.', 'Lower slowly to near-full extension.'],
    cues: [
      'The pad removes all swing, so the bottom is very stretched — do not bounce out of it.',
    ],
  },
  'spider-curl': {
    setup: 'Chest against the high side of an incline bench, arms hanging straight down.',
    steps: ['Curl the weight up.', 'Lower to full extension.'],
    cues: ['Arms hanging vertically keeps tension hardest at the top.'],
  },
  'rope-hammer-curl': {
    setup: 'Low pulley with a rope, elbows at the sides, palms facing each other.',
    steps: ['Curl the rope up, keeping the neutral grip.', 'Lower against the cable tension.'],
  },
  'drag-curl': {
    setup: 'Bar in front of the thighs, standing tall.',
    steps: [
      'Curl the bar while dragging it up the front of the body, letting the elbows travel back.',
      'Lower along the same path.',
    ],
    cues: ['The bar stays close to the torso — it does not swing out in an arc.'],
  },

  // ------------------------------------------------------------- upper back
  shrug: {
    setup: 'Bar held in front of the thighs, arms straight, standing tall.',
    steps: ['Shrug the shoulders straight up toward the ears.', 'Pause, then lower under control.'],
    cues: ['Straight up and down. Rolling the shoulders adds nothing but wear.'],
  },
  'dumbbell-shrug': {
    setup: 'A dumbbell in each hand at your sides, arms straight.',
    steps: ['Shrug straight up.', 'Pause, then lower fully.'],
  },
  'scapular-push-up': {
    setup: 'A push-up or plank position with the arms straight and locked.',
    steps: [
      'Let the chest sink between the shoulder blades without bending the elbows.',
      'Push the floor away to spread the blades apart again.',
    ],
    cues: ['Arms stay straight throughout — only the shoulder blades move.'],
  },
  'prone-y-raise': {
    setup: 'Face down on the floor or an incline bench, arms overhead in a Y, thumbs up.',
    steps: ['Raise the arms off the surface, keeping the Y shape.', 'Lower under control.'],
    cues: ['Very light or no weight. This is for the lower traps, not a lift.'],
  },
  'prone-t-raise': {
    setup: 'Face down, arms out to the sides in a T, thumbs up.',
    steps: ['Raise the arms off the surface, squeezing the shoulder blades.', 'Lower under control.'],
  },
  'reverse-snow-angel': {
    setup: 'Face down with the arms at the sides, palms down.',
    steps: [
      'Keeping the arms just off the floor, sweep them overhead in a wide arc.',
      'Sweep them back down to the sides.',
    ],
    cues: ['Slow and continuous. If the hands touch down, reduce the range.'],
  },
  'band-pull-apart': {
    setup: 'A band held at shoulder height with both hands, arms straight in front.',
    steps: ['Pull the band apart until the arms are out to the sides.', 'Return under control.'],
    cues: ['Squeeze the shoulder blades together at the end range.'],
  },
  'banded-face-pull': {
    setup: 'A band anchored at face height, one end in each hand.',
    steps: ['Pull toward the face, separating the hands and finishing with the elbows high.', 'Return under control.'],
  },

  // -------------------------------------------------------------- rear delts
  'reverse-pec-deck': {
    setup: 'Seated facing the pad, handles gripped in front at shoulder height.',
    steps: ['Open the arms out and back in a wide arc.', 'Squeeze, then return under control.'],
    cues: ['Keep the elbows soft and fixed — it is a fly, not a row.'],
  },
  'bent-over-rear-delt-raise': {
    setup: 'Hinged forward to about 45°, dumbbells hanging under the chest.',
    steps: ['Raise the arms out to the sides until level with the torso.', 'Lower under control.'],
    cues: ['Light weight. Momentum makes this useless.'],
  },
  'cable-rear-delt-fly': {
    setup: 'Two cables crossed at shoulder height, each handle taken in the opposite hand.',
    steps: ['Pull the arms out and back in a wide arc.', 'Return under control.'],
  },

  // ------------------------------------------------------------------ forearms
  'reverse-curl': {
    setup: 'Bar held with an overhand grip in front of the thighs, elbows at the sides.',
    steps: ['Curl the bar up without letting the wrists drop.', 'Lower under control.'],
    cues: ['Expect much less weight than a normal curl — that is normal.'],
  },
  'wrist-curl': {
    setup: 'Forearms resting on a bench or the thighs, palms up, wrists just past the edge.',
    steps: ['Let the bar roll to the fingertips, then curl it back up by flexing the wrists.'],
    cues: ['Small range, high reps.'],
  },
  'wrist-extension': {
    setup: 'Forearms resting on a bench or thighs, palms down, wrists past the edge.',
    steps: ['Raise the backs of the hands as far as they will go.', 'Lower under control.'],
  },
  'farmer-carry': {
    setup: 'A heavy dumbbell or kettlebell in each hand, standing tall, shoulders back.',
    steps: ['Walk for the target distance or time, keeping the torso upright and braced.'],
    cues: ['Do not let the shoulders round forward. Set the weights down deliberately, not by dropping them.'],
  },
  'dead-hang': {
    setup: 'Hanging from a bar with straight arms and a relaxed body.',
    steps: ['Hang for the target time, breathing normally.'],
    cues: ['Great for grip and for decompressing the shoulders. Build the time up gradually.'],
  },
};
