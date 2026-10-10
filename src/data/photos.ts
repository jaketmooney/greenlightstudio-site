import type { ImageMetadata } from 'astro';
import motorcycleTour from '../assets/photos/motorcycle-tour.jpg';
import officeInterviewRig from '../assets/photos/office-interview-rig.jpg';
import warehouseInterviewSet from '../assets/photos/warehouse-interview-set.jpg';
import customerVideoAnnotated from '../assets/photos/customer-video-annotated.jpg';
import warehouseInterviewBw from '../assets/photos/warehouse-interview-bw.jpg';
import cameraOperator from '../assets/photos/camera-operator.jpg';
import streetPresenter from '../assets/photos/street-presenter.jpg';
import factoryFilming from '../assets/photos/factory-filming.jpg';
import echoAsiaInterview from '../assets/photos/echo-asia-interview.jpg';
import echoAsiaField from '../assets/photos/echo-asia-field.jpg';
import echoAsiaPlanting from '../assets/photos/echo-asia-planting.jpg';
import factoryPainting from '../assets/photos/factory-painting.jpg';
import twoChairInterview from '../assets/photos/two-chair-interview.jpg';
import interviewPortrait from '../assets/photos/interview-portrait.jpg';
import interviewConversation from '../assets/photos/interview-conversation.jpg';
import studioSetup from '../assets/photos/studio-setup.jpg';

// Photos from client shoots, shown in the sliding strip under the homepage
// videos. Source: E:\GLMS\Case Studies\Photo. Two rows drift in opposite
// directions; the lightbox steps through row one, then row two. The order
// mixes clients and shot types so neighbours don't look alike.

export interface Photo {
  src: ImageMetadata;
  alt: string;
}

export const PHOTO_ROWS: Photo[][] = [
  [
    { src: motorcycleTour, alt: 'Two adventure motorcycles riding a jungle road' },
    { src: warehouseInterviewSet, alt: 'A presenter seated between lights and reflectors in a warehouse' },
    { src: factoryPainting, alt: 'Black-and-white photo of a worker spray-painting metal parts' },
    { src: streetPresenter, alt: 'A presenter with a microphone outside a building entrance' },
    { src: twoChairInterview, alt: 'Two-person interview set with armchairs and plants' },
    { src: echoAsiaInterview, alt: 'Interview frame from the ECHO Asia video' },
    { src: cameraOperator, alt: 'Camera operator holding a camera with a shotgun microphone' },
    { src: interviewConversation, alt: 'Interview subject mid-conversation beside plants' },
  ],
  [
    { src: customerVideoAnnotated, alt: 'Behind the scenes of a customer interview, with handwritten notes' },
    { src: echoAsiaField, alt: 'Farmers talking among trees, from the ECHO Asia video' },
    { src: officeInterviewRig, alt: 'Camera, monitor and lights set up for an office interview' },
    { src: interviewPortrait, alt: 'Interview subject smiling on a leather sofa' },
    { src: factoryFilming, alt: 'Filming on a factory floor in a hairnet and mask' },
    { src: echoAsiaPlanting, alt: 'Close-up of a farmer tending plants, from the ECHO Asia video' },
    { src: warehouseInterviewBw, alt: 'Black-and-white wide shot of an interview set in a warehouse' },
    { src: studioSetup, alt: 'Studio lights and a monitor framing an interview' },
  ],
];
