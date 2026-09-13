'use client';
import { useMusic } from './MusicProvider';
import s from '../experience.module.css';
export default function MusicToggle() {
  const { isPlaying, toggle } = useMusic();
  return <button type="button" onClick={toggle} aria-label={isPlaying ? 'Pause background music' : 'Play background music'} aria-pressed={isPlaying} className={s.musicControl}><span aria-hidden>{isPlaying ? 'Ⅱ' : '♪'}</span><span>{isPlaying ? 'Pause' : 'Music'}</span></button>;
}
