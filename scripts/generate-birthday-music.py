"""Rebuild our gentle synthesized Happy Birthday recording using stdlib + ffmpeg."""
from array import array
import math
from pathlib import Path
import subprocess
import tempfile
import wave

SAMPLE_RATE = 44100
BEAT = 60 / 56
MELODY = [
    (67, .5), (67, .5), (69, 1), (67, 1), (72, 1), (71, 2),
    (67, .5), (67, .5), (69, 1), (67, 1), (74, 1), (72, 2),
    (67, .5), (67, .5), (79, 1), (76, 1), (72, 1), (71, 1), (69, 1),
    (77, .5), (77, .5), (76, 1), (72, 1), (74, 1), (72, 2),
]
assert sum(beats for _, beats in MELODY) == 24
duration = .12 + 24 * BEAT + 3
samples = array('d', [0]) * math.ceil(duration * SAMPLE_RATE)


def note(midi, start, beats, gain):
    frequency = 440 * 2 ** ((midi - 69) / 12)
    offset = round((.12 + start * BEAT) * SAMPLE_RATE)
    length = min(len(samples) - offset, round((beats * BEAT + 1.5) * SAMPLE_RATE))
    for index in range(length):
        time = index / SAMPLE_RATE
        attack = min(1, time / .008)
        tone = sum(
            amplitude * math.sin(2 * math.pi * frequency * harmonic * time)
            * math.exp(-time * decay)
            for harmonic, amplitude, decay in [(1, 1, 1.5), (2, .24, 2.4), (3, .09, 3.7), (4, .04, 5)]
        )
        release = min(1, (length - index) / (SAMPLE_RATE * .08))
        samples[offset + index] += gain * attack * release * tone


beat = 0
for midi, beats in MELODY:
    note(midi, beat, beats, .55)
    beat += beats

# Quiet broken chords sit underneath the familiar melody.
for start, chord in [
    (0, [48, 55, 64]), (3, [43, 55, 62]), (6, [43, 55, 62]), (9, [48, 55, 64]),
    (12, [48, 55, 64]), (15, [41, 57, 65]), (18, [41, 57, 65]),
    (19, [48, 55, 64]), (21, [43, 55, 62]), (22, [48, 55, 64]),
]:
    for position, midi in enumerate(chord):
        note(midi, start + position * .12, 1.7, .11)

peak = max(abs(value) for value in samples)
pcm = array('h', (round(value / peak * 26000) for value in samples))
assert 25 < len(pcm) / SAMPLE_RATE < 40 and peak > .1
assert max(abs(value) for value in pcm) < 32767
assert sum(value * value for value in pcm) / len(pcm) > 1000000

output = Path(__file__).resolve().parents[1] / 'public' / 'audio' / 'happy-birthday.mp3'
output.parent.mkdir(parents=True, exist_ok=True)
with tempfile.TemporaryDirectory(dir=output.parent) as temp:
    wav_path = Path(temp) / 'birthday.wav'
    with wave.open(str(wav_path), 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())
    subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(wav_path),
        '-codec:a', 'libmp3lame', '-b:a', '96k', '-metadata', 'title=Happy Birthday',
        '-metadata', 'comment=Original locally synthesized instrumental rendition', str(output),
    ], check=True)
assert output.stat().st_size > 10000
print(f'{output}: {duration:.2f}s, {output.stat().st_size:,} bytes')
