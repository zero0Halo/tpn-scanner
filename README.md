# TPN Scanner

TPN Scanner is a mobile-first proof of concept for extracting ingredient information from Total Parenteral Nutrition (TPN) labels using a phone's camera.

The application captures an image of a label, performs OCR in the browser, and uses the resulting text and positional data to identify the ingredients, amounts, and units on the label. The extracted information is then presented alongside the original image so it can be reviewed and corrected.

## Project Status

TPN Scanner is a proof of concept and portfolio project. It was built to explore whether OCR and structured AI parsing could reliably extract useful information from photographed TPN labels.

The current implementation has been tested successfully on Android. The scanning flow does not currently complete on iOS, and iOS support is a known unresolved issue.

It is not intended for clinical use and should not be relied on for medical decisions or medication preparation.

## How It Works

The scanning flow happens in several stages:

1. The user starts the camera and photographs a TPN label.
2. PaddleOCR processes the image in the browser and extracts text, confidence values, and positional information.
3. The OCR results are sent to an API route for structured parsing.
4. The returned data is validated before being stored locally in IndexedDB.
5. The detected ingredients are displayed in an editable review form alongside the original label.

Keeping OCR in the browser reduces the amount of image data that needs to leave the device while still allowing the extracted information to be processed into a predictable structure.

## Tech

TPN Scanner is built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- PaddleOCR
- OpenAI API
- React Hook Form
- Zod
- IndexedDB

## Local Setup

Install dependencies:

```bash
yarn
```

Create a `.env.local` file with the required OpenAI API configuration.

Start the development server:

```bash
yarn dev
```

Then open `http://localhost:3000`.

The primary workflow is designed for a mobile device with a camera, so testing from a phone is recommended.

## Why I Built It

This project started with a very specific problem: TPN labels contain a large amount of ingredient information that can be tedious and error-prone to enter manually.

I wanted to see whether a browser-based application could use a phone camera to extract that information while still keeping a person in the loop to verify the results.

The interesting part of the project became the combination of image capture, client-side OCR, positional OCR data, structured AI parsing, validation, local persistence, and an editable review step rather than treating any single extraction result as automatically correct.
