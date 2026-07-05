---
title: "The $50 billion biometric security market has one blind spot"
description: "A university lab just documented how deepfakes bypass biometric security. Their fix: better algorithms. The real fix is architectural."
pubDate: 2026-07-05
author: "CertainID Team"
tags: ["Deepfakes", "Biometrics", "Security", "Architecture"]
heroImage: "/blog-images/deepfakes-biometrics.jpg"
draft: false
---

Earlier this year Loyola University Chicago's UX & Biometrics Lab published a piece on deepfakes and biometric security. It covers the usual ground: GAN quality keeps improving, deepfake audio fooled a UK energy executive into wiring EUR 220,000 in 2019, students are using deepfakes in university interviews. The proposed fixes are the usual ones too. Better detection algorithms. Liveness checking. Multi-factor authentication.

None of it is wrong. It's just pointed at the wrong thing.

The biometric security market sits at roughly $50 billion. Almost every dollar of that goes to a detection arms race. Build a better facial recognition model, then build a better deepfake to fool it, then build a better detector again. The generation side runs on the same deep learning advances as the detection side. There is no reason to think detection ever gets ahead for good, because every detection breakthrough is also a generation breakthrough. That is what the GAN architecture does.

But that is the wrong fight.

The actual problem is not that deepfakes are getting too good. The actual problem is that biometric data travels across the internet to get verified.

Every cloud-based biometric system works the same way. Your phone captures your face or fingerprint. That data gets encrypted and sent to a server. The server compares it against a stored template. If it matches, you are in. The transmission, the server, the stored template -- that is the attack surface. A deepfake that fools the model is one vector. Intercepting the transmission is another. Breaching the server and stealing the templates is a third. Three points of failure before the detection algorithm even runs.

The alternative is to not send anything.

CertainID processes biometrics on-device. The phone captures your face. The phone runs the liveness check. The phone generates a cryptographic hash of the verification. That hash is the only thing that leaves your device. It gets anchored to a public blockchain. Anyone can verify it. No one can reverse it into your biometric data. There is no server holding your face. There is no transmission to intercept. There is no stored template to steal.

This is not a detection improvement. It is an architectural difference. The detection arms race assumes you are trying to tell real from fake at a shared verification point. On-device processing assumes you never create a shared verification point in the first place.

Loyola's piece concludes that "technology can't solve everything" and that human observation has to be part of the equation. That is true for their architecture. It is not true for ours. When no biometric data leaves the device, deepfake quality stops mattering. An attacker can generate the most realistic face in the world. It does not help them because the verification never happens where they can reach it.

The $50 billion biometric security market is spending almost all its money on the wrong problem. The fix is not a better algorithm. The fix is an architecture that removes the transmission path entirely.

Three granted patents. Zero data collected. One hash on-chain.