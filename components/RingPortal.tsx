// 'use client';
// import { useEffect, useRef } from 'react';
// import { gsap } from '@/lib/gsap';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
// export default function RingPortal({ onDone }: { onDone: () => void }) {
//   const host = useRef<HTMLDivElement>(null),
//     done = useRef(onDone);
//   done.current = onDone;
//   useEffect(() => {
//     const el = host.current;
//     if (!el) return;
//     if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
//       done.current();
//       return;
//     }
//     let disposed = false,
//       finished = false,
//       renderer: THREE.WebGLRenderer | undefined,
//       env: THREE.WebGLRenderTarget | undefined,
//       tl: gsap.core.Timeline | undefined,
//       frame = 0,
//       model: THREE.Object3D | undefined;
//     const finish = () => {
//       if (!finished && !disposed) {
//         finished = true;
//         done.current();
//       }
//     };
//     const timeout = window.setTimeout(finish, 12000);
//     const scene = new THREE.Scene(),
//       camera = new THREE.PerspectiveCamera(36, 1, 0.01, 100);
//     const release = (root: THREE.Object3D) =>
//       root.traverse((o) => {
//         if (o instanceof THREE.Mesh) {
//           o.geometry.dispose();
//           (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
//         }
//       });
//     try {
//       renderer = new THREE.WebGLRenderer({
//         antialias: true,
//         alpha: true,
//         powerPreference: 'low-power',
//       });
//       renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
//       renderer.setClearColor(0x000000, 0);
//       renderer.toneMapping = THREE.ACESFilmicToneMapping;
//       renderer.toneMappingExposure = 1.5;
//       el.appendChild(renderer.domElement);
//       const pmrem = new THREE.PMREMGenerator(renderer),
//         room = new RoomEnvironment();
//       env = pmrem.fromScene(room, 0.04);
//       scene.environment = env.texture;
//       room.dispose();
//       pmrem.dispose();
//       scene.add(new THREE.HemisphereLight(0xfff2d9, 0x715039, 2));
//       const key = new THREE.DirectionalLight(0xffe2a8, 4);
//       key.position.set(3, 4, 5);
//       scene.add(key);
//       camera.position.z = 5.5;
//       const resize = () => {
//         if (!renderer) return;
//         camera.aspect = el.clientWidth / el.clientHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize(el.clientWidth, el.clientHeight);
//       };
//       resize();
//       const observer = new ResizeObserver(resize);
//       observer.observe(el);
//       new GLTFLoader().load(
//         '/models/wedding-ring.glb',
//         (g) => {
//           if (disposed) {
//             release(g.scene);
//             return;
//           }
//           model = g.scene;
//           const alignment = new THREE.Group();
//           alignment.add(model);
//           alignment.quaternion.setFromUnitVectors(
//             new THREE.Vector3(-0.2765, -0.2278, 0.9336).normalize(),
//             new THREE.Vector3(0, 0, 1),
//           );
//           const box = new THREE.Box3().setFromObject(alignment),
//             size = box.getSize(new THREE.Vector3()),
//             center = box.getCenter(new THREE.Vector3());
//           alignment.position.sub(center);
//           const pivot = new THREE.Group();
//           pivot.add(alignment);
//           const scale = 2.45 / Math.max(size.x, size.y, size.z);
//           pivot.scale.setScalar(scale);
//           scene.add(pivot);
//           model.traverse((o) => {
//             if (o instanceof THREE.Mesh) {
//               const old = o.material as THREE.MeshStandardMaterial;
//               const gem = old.transparent;
//               old.dispose();
//               o.material = new THREE.MeshPhysicalMaterial(
//                 gem
//                   ? {
//                       color: 0xfff7e9,
//                       metalness: 0.15,
//                       roughness: 0.07,
//                       clearcoat: 1,
//                       transparent: true,
//                       opacity: 0.88,
//                     }
//                   : { color: 0xcba35c, metalness: 1, roughness: 0.2, clearcoat: 1 },
//               );
//             }
//           });
//           pivot.rotation.set(0.08, -1.3, -0.18);
//           gsap.set(el, { opacity: 0 });
//           tl = gsap
//             .timeline()
//             .to(el, { opacity: 1, duration: 0.8 })
//             .to(
//               pivot.rotation,
//               { y: Math.PI * 2, x: 0, z: 0, duration: 2.8, ease: 'power2.inOut' },
//               0.2,
//             )
//             .to('.ring-intro-copy', { opacity: 0, y: -15, duration: 0.6 }, 2.8)
//             .to(camera.position, { z: 0.08, duration: 2.2, ease: 'power3.in' }, 3)
//             .to(el.parentElement, { opacity: 0, duration: 0.65, onComplete: finish }, 4.75);
//         },
//         undefined,
//         finish,
//       );
//       const render = () => {
//         if (disposed) return;
//         renderer?.render(scene, camera);
//         frame = requestAnimationFrame(render);
//       };
//       render();
//       return () => {
//         disposed = true;
//         clearTimeout(timeout);
//         observer.disconnect();
//         cancelAnimationFrame(frame);
//         tl?.kill();
//         gsap.killTweensOf(el);
//         release(scene);
//         env?.dispose();
//         renderer?.dispose();
//         renderer?.domElement.remove();
//       };
//     } catch {
//       finish();
//     }
//     return () => {
//       disposed = true;
//       clearTimeout(timeout);
//       cancelAnimationFrame(frame);
//       tl?.kill();
//       release(scene);
//       env?.dispose();
//       renderer?.dispose();
//     };
//   }, []);
//   return (
//     <div className="ring-intro">
//       <div ref={host} className="ring-canvas" />
//       <div className="ring-intro-copy">
//         <p className="eyebrow">A promise. A lifetime.</p>
//         <p className="ring-script">It begins with forever</p>
//       </div>
//       <button className="skip-intro" onClick={() => done.current()}>
//         Skip introduction ↗
//       </button>
//       <p className="ring-caption">Brendon & Maria · 28 December 2026</p>
//     </div>
//   );
// }


'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { gsap } from '@/lib/gsap';
import { useMusic } from '@/components/audio/MusicProvider';

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export default function RingPortal({
  onDone,
}: {
  onDone: () => void;
}) {
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const entryContentRef =
    useRef<HTMLDivElement>(null);

  const animationRef = useRef<(() => void) | null>(
    null,
  );

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  const [modelReady, setModelReady] = useState(false);
  const [started, setStarted] = useState(false);

  const { enter } = useMusic();

  useEffect(() => {
    const host = canvasHostRef.current;

    if (!host) {
      return;
    }

    let disposed = false;
    let completed = false;
    let frameId = 0;

    let renderer: THREE.WebGLRenderer | null = null;
    let environment:
      | THREE.WebGLRenderTarget
      | null = null;

    let animation:
      | gsap.core.Timeline
      | null = null;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      1,
      0.01,
      100,
    );

    camera.position.set(0, 0, 5.5);

    const finish = () => {
      if (completed || disposed) {
        return;
      }

      completed = true;
      doneRef.current();
    };

    const disposeObject = (
      object: THREE.Object3D,
    ) => {
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) {
          return;
        }

        child.geometry?.dispose();

        const materials = Array.isArray(
          child.material,
        )
          ? child.material
          : [child.material];

        materials.forEach((material) => {
          material?.dispose();
        });
      });
    };

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.75),
      );

      renderer.setClearColor(0x000000, 0);

      renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

      renderer.toneMappingExposure = 1.45;

      host.appendChild(renderer.domElement);

      const pmremGenerator =
        new THREE.PMREMGenerator(renderer);

      const roomEnvironment =
        new RoomEnvironment();

      environment = pmremGenerator.fromScene(
        roomEnvironment,
        0.04,
      );

      scene.environment = environment.texture;

      roomEnvironment.dispose();
      pmremGenerator.dispose();

      const ambientLight =
        new THREE.HemisphereLight(
          0xfff1d8,
          0x6e4935,
          2,
        );

      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(
        0xffdfa5,
        4,
      );

      keyLight.position.set(3, 4, 5);

      scene.add(keyLight);

      const resize = () => {
        if (!renderer) {
          return;
        }

        const width = host.clientWidth;
        const height = host.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };

      resize();

      const resizeObserver = new ResizeObserver(
        resize,
      );

      resizeObserver.observe(host);

      const loader = new GLTFLoader();

      loader.load(
        '/models/wedding-ring.glb',

        (gltf) => {
          if (disposed) {
            disposeObject(gltf.scene);
            return;
          }

          const model = gltf.scene;

          /*
           * Reorient the supplied model so the ring opening
           * faces the camera.
           */
          const alignment = new THREE.Group();

          alignment.add(model);

          alignment.quaternion.setFromUnitVectors(
            new THREE.Vector3(
              -0.2765,
              -0.2278,
              0.9336,
            ).normalize(),

            new THREE.Vector3(0, 0, 1),
          );

          const boundingBox =
            new THREE.Box3().setFromObject(
              alignment,
            );

          const modelSize =
            boundingBox.getSize(
              new THREE.Vector3(),
            );

          const modelCenter =
            boundingBox.getCenter(
              new THREE.Vector3(),
            );

          alignment.position.sub(modelCenter);

          const ringPivot = new THREE.Group();

          ringPivot.add(alignment);

          const normalizedScale =
            2.45 /
            Math.max(
              modelSize.x,
              modelSize.y,
              modelSize.z,
            );

          ringPivot.scale.setScalar(
            normalizedScale,
          );

          /*
           * Static waiting position.
           * No automatic rotation happens here.
           */
          ringPivot.rotation.set(
            0.08,
            -1.3,
            -0.18,
          );

          scene.add(ringPivot);

          model.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) {
              return;
            }

            const oldMaterial =
              child.material as THREE.Material;

            const transparent =
              'transparent' in oldMaterial &&
              oldMaterial.transparent;

            oldMaterial.dispose();

            child.material =
              new THREE.MeshPhysicalMaterial(
                transparent
                  ? {
                      color: 0xfff8eb,
                      metalness: 0.1,
                      roughness: 0.08,
                      clearcoat: 1,
                      transparent: true,
                      opacity: 0.86,
                    }
                  : {
                      color: 0xc9a15b,
                      metalness: 1,
                      roughness: 0.19,
                      clearcoat: 1,
                      clearcoatRoughness: 0.1,
                    },
              );
          });

          gsap.fromTo(
            host,
            {
              opacity: 0,
              scale: 0.96,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: 'power3.out',
            },
          );

          /*
           * Save the animation, but do not run it yet.
           * It runs only after the visitor chooses an
           * entry button.
           */
          animationRef.current = () => {
            if (
              animation ||
              disposed ||
              completed
            ) {
              return;
            }

            animation = gsap.timeline({
              defaults: {
                ease: 'power3.inOut',
              },
            });

            animation
              .to(
                entryContentRef.current,
                {
                  opacity: 0,
                  y: -18,
                  duration: 0.55,
                  pointerEvents: 'none',
                },
                0,
              )

              .to(
                ringPivot.rotation,
                {
                  x: 0,
                  y: Math.PI * 2,
                  z: 0,
                  duration: 2.8,
                  ease: 'power2.inOut',
                },
                0.15,
              )

              .to(
                ringPivot.scale,
                {
                  x: normalizedScale * 1.18,
                  y: normalizedScale * 1.18,
                  z: normalizedScale * 1.18,
                  duration: 1.2,
                  ease: 'power2.out',
                },
                2,
              )

              .to(
                camera.position,
                {
                  z: 0.08,
                  duration: 2.15,
                  ease: 'power3.in',
                },
                2.65,
              )

              .to(
                host.parentElement,
                {
                  opacity: 0,
                  duration: 0.7,
                  ease: 'power2.inOut',
                  onComplete: finish,
                },
                4.35,
              );
          };

          setModelReady(true);
        },

        undefined,

        () => {
          /*
           * If the GLB fails, keep the entrance usable.
           * The user can still choose music and continue.
           */
          animationRef.current = finish;
          setModelReady(true);
        },
      );

      const render = () => {
        if (disposed) {
          return;
        }

        renderer?.render(scene, camera);

        frameId =
          window.requestAnimationFrame(render);
      };

      render();

      return () => {
        disposed = true;

        resizeObserver.disconnect();

        window.cancelAnimationFrame(frameId);

        animation?.kill();

        gsap.killTweensOf(host);
        gsap.killTweensOf(
          entryContentRef.current,
        );

        disposeObject(scene);

        environment?.dispose();
        renderer?.dispose();
        renderer?.domElement.remove();

        animationRef.current = null;
      };
    } catch {
      setModelReady(true);
      animationRef.current = finish;
    }

    return () => {
      disposed = true;

      window.cancelAnimationFrame(frameId);

      animation?.kill();

      disposeObject(scene);

      environment?.dispose();
      renderer?.dispose();

      animationRef.current = null;
    };
  }, []);

  const beginExperience = (
    withMusic: boolean,
  ) => {
    if (!modelReady || started) {
      return;
    }

    setStarted(true);

    /*
     * This runs directly inside the click event.
     * Music playback is therefore allowed by the browser.
     */
    enter(withMusic);

    animationRef.current?.();
  };

  return (
    <div className="ring-entry-screen">
      <div
        ref={canvasHostRef}
        className="ring-canvas"
      />

      <div
        ref={entryContentRef}
        className="ring-entry-content"
      >
        <p className="eyebrow ring-entry-eyebrow">
          A promise · A lifetime
        </p>

        <h1 className="ring-entry-title">
          It begins
          <em>with forever</em>
        </h1>

        <div className="ring-entry-divider">
          <span />
          <i>✧</i>
          <span />
        </div>

        <p className="ring-entry-message">
          Enter our story
        </p>

        <div className="ring-entry-actions">
          <button
            type="button"
            className="ring-entry-primary"
            disabled={!modelReady || started}
            onClick={() =>
              beginExperience(true)
            }
          >
            <span>
              {modelReady
                ? 'Enter with music'
                : 'Preparing our story…'}
            </span>

            {modelReady && (
              <i aria-hidden>♫</i>
            )}
          </button>

          <button
            type="button"
            className="ring-entry-secondary"
            disabled={!modelReady || started}
            onClick={() =>
              beginExperience(false)
            }
          >
            Enter without music
          </button>
        </div>
      </div>

      <p className="ring-entry-caption">
        Brendon &amp; Maria
        <span>·</span>
        28 December 2026
      </p>
    </div>
  );
}