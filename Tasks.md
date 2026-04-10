Please create a demo app for showing how Solid-DToU works. I want to use it to demonstrate the technical advantage compared to other approaches (e.g. plain WAC/ACP, SAI, ODRL, etc). I'll use it during Solid Symposium (SoSy) 2026, and probably reuse it later in other venues or the general public later.

I'm writing this document to provide relevant information, and describe my thoughts (including designs). It is not necessarily the best one, so feel free to give your advise.

## Information about Solid-DToU

It is a part of my research in Oxford, and we have a paper accepted at WWW 2024. Its key part is the DToU language and reasoner, and we have integrated it with Solid (through additional API endpoints).

Paper: https://arxiv.org/abs/2403.07587

Repo: https://github.com/renyuneyun/solid-dtou
    Corresponding Github Pages: https://me.ryey.icu/solid-dtou/
    It contains links to my existing implementations, including an earlier version of a demo app

Spec: https://me.ryey.icu/solid-dtou/dtou-spec.html
    It's roughly complete, IIRC


## Distinction of DToU

The key design distinction of DToU is to allow non-coordinated parties to check the compatibility of their data usage policies, through a carefully designed policy language. By non-coordinated parties, I mean the data owner and apps. Usually when using an app, it needs to request permission from the user to login as the user and access their Pods; the common approach is to perform this manually -- the user reads through the privacy policy and other descriptions of the app, and make a decision; in DToU, the app describes how it handles the data (as *app policy*), and the policy engine automatically checks that against the user's preference on how apps can use their data (as *data policy*); the specific distinction is that the user only specifies *data policy* once (for every type or location of data, subject to the user's will) and the app also only specifies their *app policy* once, and the policy engine is able to reason about that, regardless of which user or which app it was from; this is supported by two aspects: a) they will need to use shared vocabularies/ontologies (or `owl:sameAs` after ontological reasoning) for the expression of concepts (e.g. purposes); b) any output data will receive a corresponding *data policy* derived from the input data's *data policies*, subject to transformation information described in the *app policy*.

This lowers the accountability or management burden of users, and the user-pursuasive burden of app developers, to allow easy checking between policy compatibility. This is a big advancement for decentralized Web ecosystem.


## Rough design

Create three (mock) apps A, B and C, for different designs and features, but using many shared data. Note they should not all belong to the same type of apps, in case that makes the distinction not obvious.

The three apps need to have clear and easy-to-understand goals, for showing in a presentataion / demo with limited time. App B and C can have similar features, but with some critical differences in their handling of data, leading to the user not wanting to use C but allows using B.

Then, create relevant data policies for the relevant types of data (write them down for me; I'll put them into the Pod). You may also want to create mock data.

Create relevant app policies for all three apps. Create relevant API calls and handling of the policies. Create appropriate visualization or showing of the app policies and reasoning results.

## Additional points

Policies need to be written down in your design phase, so I can check and verify before proceedings.

Please write correct policies for the DToU language. You will need to consult the paper or the spec to understand the language. You may also ask me if in doubt.

For technical details, use Vue for UI framework.