---
pagetitle: Early Dreams of Numerical Weather Prediction and Chaos
---

# Early Dreams of Numerical Weather Prediction and Chaos

<span style="font-size: 1rem">Edward Wawrzynek, 6 May 2025</span>

The first modern weather forecast was produced in 1949 by a team at Princeton’s Institute for Advanced Study led by Jule Gregory Charney <a href="#ref1">[1]</a>. The forecast, which predicted the motion of the atmosphere over 24 hours, had taken several days to compute. By the time it was completed, the motions it predicted would have occurred several days prior. The team was using the ENIAC–a colossal computing machine the size of a room, the first to be programmable for general purpose computing problems. Composed of 18,000 vacuum tubes that had to be frequently replaced, the ENIAC had been designed for the US Army to compute artillery firing tables during WWII, but was now being pressed into service to demonstrate computing’s ability to transform non-military fields.

<div style="width: 65%; margin: 1rem 0 1rem 1rem; float: right;">
<img src="/images/nwp/eniac.jpg"/>
<span style="font-size: 0.9rem">Fig. 1: The Electronic Numerical Integrator and Computer (ENIAC), the computer used to produce Charney’s forecasts. The ENIAC was the first programmable general purpose computer, built at the US Army’s Ballistic Research Lab in 1945.</span>
</div>

The basic equations governing the evolution of the atmosphere had been well known since the late 19th century, but they were enormously complicated and involved physical quantities throughout the atmosphere that were nearly impossible to measure. Charney’s insight was to develop a simplified model, called the barotropic vorticity equation <a href="#ref2">[2]</a>, which captured the complex horizontal motion of the atmosphere while assuming a very simple vertical profile. 

Rather than predicting the familiar variables of temperature or wind speed, Charney’s equations were written in terms of the geopotential height. Geopotential height describes how high a region of fixed pressure is in the atmosphere. Meteorologists had long understood that the distribution of pressure through the atmosphere was the main force driving atmospheric motion, so the choice of geopotential height as the prognostic variable made natural sense to Charney.

The team understood that their forecasts wouldn’t be all that practical. Though the geopotential height captures the atmosphere’s movement, it can’t actually predict much about how a human on the Earth’s surface experiences weather. To predict temperature, storms, wind, precipitation, or any of the other meteorological concerns of daily life required far more processing ability than the ENIAC offered. The project at Princeton was always intended to be temporary—its goals were to demonstrate that the principle of numerical weather forecasting was sound, then to give way to new efforts with the more advanced computers expected to be soon available.

As Charney’s team became familiar with the process of producing forecasts on the ENIAC, which involved human intervention to move hundreds of data storage cards through the machine, they were able to get the computation time to slightly less than 24 hours, producing at last true predictions. When plotted against the actual weather patterns that developed, some of these predictions are remarkably accurate, and easily matched or exceeded the skill of traditional human meteorologists at the time. When the atmosphere was particularly chaotic, however, the predictions were close to nonsense.

<img src="/images/nwp/forecast.png"/>
<span style="font-size: 0.9rem">Fig. 2: A forecast produced by Charney’s team. The left plot shows 500 hPa geopotential height over the US on Jan 29, 1949 at 10 PM EST, while the right plot shows the ENIAC’s predictions for 24 hours later. The two plots show the large-scale atmospheric motion and mixing that has occurred over the course of a day. Plots taken from <a href="#ref1">[1]</a>.</span>

The efforts at Princeton were not the first to try to predict the atmosphere by numerical means. Over two decades before in 1922, the prolific English mathematician Lewis Fry Richardson had attempted a similar scheme, trying to retroactively predict the weather midday on May 20, 1910 using weather observations from 7AM in the morning <a href="#ref3">[3]</a>. In many ways, his scheme was far more sophisticated than that undertaken at Princeton, being much closer to the modern models used in meteorology. Lacking computers, his computations took months to perform by hand, and yielded a disastrous result: they predicted a huge increase of 145 hPa in atmospheric pressure, when in reality no such increase occurred. When he analyzed the error, he realized that his prediction had captured a small fluctuation, called a gravity wave, that was occurring in the morning but failed to capture the wider dynamics that would dominate the day’s weather. Unperturbed by the error, he imagined a forecast factory: computation undertaken by hand at a scale never seen before:

> Imagine a large hall like a theatre, except that the circles and galleries go right round through the space usually occupied by the stage. The walls of this chamber are painted to form a map of the globe. The ceiling represents the north polar regions, England is in the gallery, the tropics in the upper circle, Australia on the dress circle and the antarctic in the pit. A myriad computers are at work upon the weather of the part of the map where each sits, but each computer attends only to one equation or part of an equation…Four senior clerks in the central pulpit are collecting the future weather as fast as it is being computed, and despatching it by pneumatic carrier to a quiet room. There it will be coded and telephoned to the radio transmitting station.” <a href="#ref3">[3]</a>.

<div style="width: 65%; margin: 1rem 0 1rem 1rem; float: right;">
<img src="/images/nwp/factory.png"/>
<span style="font-size: 0.9rem">Fig 3. Richardson’s weather forecasting factory as described in 1922 in <a href="#ref3">[3]</a>, illustrated by Stephen Conlin in 1986. Human computers spread about the outside of the building produce computations by hand, their results displayed on the globe. A conductor at the central podium shines light upon areas running behind, while workers on the floor rush predictions off to be transmitted to the outside world.</span>
</div>

When Richardson described his factory, the word “computer” didn’t yet have its modern meaning. To him, it simply described a human who computes. Even so, his description was remarkably prophetic—many of its elements match up with the structure of the ENIAC, and his description of many human computers working at the same time is eerily similar to the massively parallel architectures used in modern forecasting systems.

The kinds of prediction instability that both Richardson and the Princeton team encountered continued to haunt forecasting efforts for decades. Dynamicists working on meteorology in the years following the ENIAC predictions would begin to develop a theory of nonlinear dynamics that was able to explain why some predictions seemed to match the atmosphere’s behavior so well and why others produced nonsense. 

<div style="width: 45%; margin: 1rem 0 1rem 1rem; float: right;">
<img src="/images/nwp/lorenz.png"/>
<span style="font-size: 0.9rem">Fig 4. Lorenz’ model of a single particle caught in a convective cell in the atmosphere. The particle chaotically hops between the loop labelled C and the loop labelled C’. Predicting which loop it follows requires increasingly sensitive knowledge of exactly where the particle started. Plot taken from <a href="#ref4">[4]</a>. This plot’s resemblance to a butterfly has led to chaotic dynamics being popularly referred to as “butterfly effects”.</span>
</div>

By 1961, Edward Lorenz, a young research scientist at MIT, was able to show that these prediction instabilities were a fundamental feature of atmospheric dynamics themselves. He developed a model tracing the path of a single particle circulating through a simple convective cell, and showed that the path it took was highly dependent on exactly where it started. Even further, predicting even basic features of the particle’s movement required rapidly increasing knowledge of exactly where the particle started. For a system as complex as the atmosphere, this kind of knowledge was nearly impossible to obtain. Meteorologists could measure conditions at a few stations spread across the county, but most of the atmosphere’s state had to be estimated. Even tiny errors in this estimation turned into unworkable errors in weather predictions after only a day or two.

The chaotic behaviors that Charney, Richardson, and Lorenz identified remain the principle challenge in modern weather prediction. At the present time, little fundamental progress has been made in getting around these restrictions. Modern weather prediction has improved because it has access to more computing power, which allows atmospheric motions to be tracked at finer resolution and shorter timescales. But even the most advanced of current predictions lose track of the atmosphere's motion after about a week. After eight decades of research, the atmosphere's chaotic nature will likely remain a challenge to practitioners of numerical weather prediction for a while yet to come.

<img src="/images/nwp/vis.png"/>
<span style="font-size: 0.9rem">Fig 5. A visibility forecast over mainland Europe for the evening of 6 May 2025 produced by the <a href="https://www.ecmwf.int">European Centre for Medium-Range Weather Forecasts (ECMWF)</a>, one of the leading operational centers in numerical weather prediction. The computer used to make this forecast has 30 petaflops ($30\times 10^{15}$ calculations per second) of computing performance, or about $10^{15}$ (a million billion) times as much as ENIAC. </span>

## References
<span id="ref1">[1] Charney, Jules G., Ragnar Fjörtoft, and J. von Neumann. <a href="https://www.tandfonline.com/doi/abs/10.3402/tellusa.v2i4.8607">"Numerical integration of the barotropic vorticity equation."</a> Tellus 2.4 (1950): 237-254.</span>

<span id="ref2">[2] Charney, Jule G. <a href="https://link.springer.com/chapter/10.1007/978-1-944970-35-2_14">"On the scale of atmospheric motions."</a> Geofysiske Publikasjoner 17.2 (1948): 251-265.</span>

<span id="ref3">[3] Richardson, Lewis F. Weather prediction by numerical process. University Press, 1922.</span>

<span id="ref4">[4] Lorenz, E. N.. “Deterministic nonperiodic flow.” Journal of the Atmospheric Sciences 20.2 (1963): 130–141.</span>

