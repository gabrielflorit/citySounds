/*global describe:true*/
/*global expect:true*/
/*global it:true*/
/*global tsw:true*/

describe('Theresa\'s Sound World', function () {
    'use strict';

    describe('Core', function () {

        describe('Audio Context', function () {

            it('Context exists', function () {
                expect(typeof tsw.context).toEqual('function');
            });
        });

        describe('Output', function () {

            it('Speakers exist', function () {
                expect(typeof tsw.speakers).toEqual('object');
            });
        });

        describe('Time', function () {
            it('Now is current context time', function () {
                expect(tsw.context().currentTime).toEqual(tsw.now());
            });
        });

        describe('Nodes', function () {
            it('Can create node', function () {
                expect(tsw.createNode().nodeType).toEqual('default');
            });
        });

        describe('Browser Support', function () {
            it('Browser is supported', function () {
                expect(tsw.isBrowserSupported).toEqual(true);
            });
        });

        describe('Create Buffer', function () {
            it('Node is a Buffer', function () {
                expect(tsw.buffer().nodeType).toEqual('buffer');
            });
        });

        describe('Create Oscillator', function () {

            it('Node is an OscillatorNode', function () {
                expect(tsw.oscillator().nodeType).toEqual('oscillator');
            });

            it('Default type is a sine wave', function () {
                expect(tsw.oscillator().type()).toEqual('sine');
            });

            it('Creates a sine wave.', function () {
                expect(tsw.oscillator(300, 'sine').type()).toEqual('sine');
            });

            it('Creates a square wave.', function () {
                expect(tsw.oscillator(200, 'square').type()).toEqual('square');
            });

            it('Creates a triangle wave', function () {
                expect(tsw.oscillator(100, 'triangle').type()).toEqual('triangle');
            });

            it('Creates a sawtooth wave', function () {
                expect(tsw.oscillator(50, 'sawtooth').type()).toEqual('sawtooth');
            });

            it('Creates a sine wave with a certain frequency', function () {
                var osc = tsw.oscillator(500, 'sawtooth');
                expect(osc.frequency()).toEqual(500);
            });

            it('Sets the frequency', function () {
                var osc = tsw.oscillator('sine');
                osc.frequency(900);
                expect(osc.frequency()).toEqual(900);
            });
        });

        describe('Create Gain', function () {

            it('Node should be a GainNode', function () {
                expect(tsw.gain().nodeType).toEqual('gain');
            });

            it('Default gain value should be 1', function () {
                expect(tsw.gain().gain()).toEqual(1);
            });

            it('Create gain node with different gain level than default', function () {
                expect(tsw.gain(0.5).gain()).toEqual(0.5);
            });

            it('Create gain node and change gain level after creation', function () {
                var volume = tsw.gain();
                volume.gain(0.2);
                expect(volume.gain()).toEqual(0.20000000298023224);
            });

            it('Change gain at a specified time', function (done) {
                var osc = tsw.oscillator(),
                vol = tsw.gain(0.2),
                mute = tsw.gain(0);

                tsw.connect(osc, vol, mute, tsw.speakers);
                osc.start(tsw.now());
                osc.stop(tsw.now() + 5);
                vol.gain(0.5, tsw.now() + 2);

                setTimeout(function () {
                    expect(vol.gain()).toEqual(0.5);
                    done();
                }, 3000);
            });
        });

        describe('Create Wait', function () {

            it('Node should be a wait node', function () {
                expect(tsw.wait().nodeType).toEqual('wait');
            });

            it('Default delayTime value should be 1', function () {
                expect(tsw.wait().time()).toEqual(1);
            });

            it('Create wait node with different wait time than default', function () {
                expect(tsw.wait(0.5).time()).toEqual(0.5);
            });

            it('Create wait node and change wait time after creation', function () {
                var wait = tsw.wait();
                wait.time(0.2);
                expect(wait.time()).toEqual(0.20000000298023224);
            });
        });

        describe('Create Panner', function () {
            it('Node should be a panner node', function () {
                expect(tsw.panner().nodeType).toEqual('panner');
            });

            it('Default panning should be 0', function () {
                expect(tsw.panner().pan()).toEqual(0);
            });

            it('Create panner with different panning than default', function () {
                expect(parseFloat(tsw.panner(-0.8).pan().toFixed(1))).toEqual(-0.8);
            });

            it('Create panning at a specified time', function (done) {
                var osc = tsw.oscillator(),
                    mute = tsw.gain(0),
                    panner = tsw.panner();

                tsw.connect(osc, mute, panner, tsw.speakers);
                osc.start(tsw.now());

                panner.pan(-1, tsw.now() + 1);

                // Check change hasn't happened early.
                expect(panner.pan()).toEqual(0);

                setTimeout(function () {
                    expect(Math.round(panner.pan())).toEqual(-1);
                    done();
                }, 2000);
            });
        });

        describe('Create Filter', function () {
            it('Node should be a filter node', function () {
                expect(tsw.filter().nodeType).toEqual('filter');
            });

            it('Default filter type should be lowpass', function () {
                expect(tsw.filter().type()).toEqual('lowpass');
            });

            it('Create filter with different filter type than default', function () {
                expect(tsw.filter('highpass').type()).toEqual('highpass');
            });
        });

        describe('Create LFO', function () {
            it('Node should be an LFO node', function () {
                expect(tsw.lfo().nodeType).toEqual('lfo');
            });

            it('Default LFO frequency should be 10Hz', function () {
                expect(tsw.lfo().frequency()).toEqual(10);
            });

            it('Create LFO with different frequency than default', function () {
                expect(tsw.lfo(5).frequency()).toEqual(5);
            });
        });

        describe('Create Compressor', function () {
            it('Check compressor node type', function () {
                expect(tsw.compressor().nodeType).toEqual('compressor');
            });
        });


        /*
        describe('Create Envelope', function () {
            var osc = tsw.oscillator(),
                volume = tsw.gain(),
                mute = tsw.gain(0),
                envelope = tsw.envelope({
                    param: volume.params.gain,
                    startLevel: 0,
                    maxLevel: 1,
                    sustainLevel: 0.6,
                    attackTime: 2,
                    decayTime: 1,
                    autoStop: false
                });

            tsw.connect(osc, volume, mute, tsw.speakers);

            osc.start(tsw.now());
            osc.stop(tsw.now() + 8);

            it('Should be an envelope', function () {
                expect(tsw.envelope().nodeType).toEqual('envelope');
            });

            // Start Level
            it('Start level should be zero-ish', function (done) {
                envelope.start();

                setTimeout(function () {
                    expect(volume.gain()).toBeLessThan(0.1);
                    done();
                }, 100);
            });

            // Attack
            it('Should attack', function (done) {
                setTimeout(function () {
                    expect(volume.gain()).toBeGreaterThan(0.1);
                    done();
                }, 100);
            });

            // Decay
            it('Should decay', function (done) {
                expect(parseFloat(volume.gain().toFixed(1))).toBeLessThan(1);
                done();
            });

            // Sustain
            it('Should sustain', function (done) {
                setTimeout(function () {
                    expect(parseFloat(volume.gain().toFixed(1))).toEqual(0.6);
                    done();
                }, 1500);
            });

            // Still sustaining?
            it('Should still be sustaining', function (done) {
                expect(parseFloat(volume.gain().toFixed(1))).toEqual(0.6);
                envelope.stop();
                done();
            });

            // Release
            it('Should release', function (done) {
                setTimeout(function () {
                    expect(volume.gain()).toBeLessThan(0.6);
                    done();
                }, 1000);
            });

        });
        */        

        describe('Create Noise', function () {

            it('Node nodeType is "noise"', function () {
                expect(tsw.noise().nodeType).toEqual('noise');
            });
        });

        describe('Load files', function () {

            var my_success;

            it('Load some mp3s', function (done) {
                tsw.load({
                    files: {
                        sampleOne: 'samples/tsw1.mp3',
                        sampleTwo: 'samples/tsw2.mp3',
                        sampleThree: 'samples/tsw3.mp3',
                    }
                }, function (success) {
                    my_success = success;
                    done();
                });
            });

            it('mp3s should be loaded', function () {
                expect(Object.keys(my_success).length).toEqual(3);
            });

            it('Load some files that don\'t exist', function () {
                tsw.load({
                    files: {
                        sampleOne: 'samples/nope1.mp3',
                        sampleTwo: 'samples/nope2.mp3',
                        sampleThree: 'samples/nope3.mp3'
                    }
                }, function () {
                    // do nothing
                }, function () {
                    //expect(true).toEqual(true);
                });
            });
        });

    
        /**
        * Fade in/out has been removed while waiting for Firefox documentation.
        * https://github.com/stuartmemo/theresas-sound-world/issues/18
        */

        /*
        describe('Fade In', function () {

            it('Oscillator node fades in', function (done) {
                var osc = tsw.oscillator(),
                    mute = tsw.gain(0);

                expect(osc.output.gain.value).toEqual(1);

                tsw.connect(osc, mute, tsw.speakers);
                osc
                    .start(tsw.now())
                    .fadeIn();

                osc.stop(tsw.now() + 3);

                setTimeout(function () {
                    expect(osc.output.gain.value).toEqual(1);
                    done();
                }, 1000);
            });
        });

        describe('Fade Out', function () {

            it('Oscillator node fades out', function (done) {
                var osc = tsw.oscillator(),
                    mute = tsw.gain(0);

                expect(osc.output.gain.value).toEqual(1);
                tsw.connect(osc, mute, tsw.speakers);
                osc
                    .start(tsw.now())
                    .fadeOut();

                setTimeout(function () {
                    expect(osc.output.gain.value).toEqual(0);
                    done();
                }, 4000);
            });
        });
        */
    });

    describe('Effects', function () {

        it('Create delay effect', function () {
            // tsw.delay();
        });

        it('Create phaser effect', function () {
            tsw.phaser();
        });

        it('Create tremolo effect', function () {
            // tsw.tremolo();
        });
    });

    describe('Music', function () {
        it('Turns sharp note into equivalent flat note', function () {
            expect(tsw.flat('A#')).toEqual('Bb');
            expect(tsw.flat('G#')).toEqual('Ab');
        });

        it('Turns flat note into equivalent sharp note', function () {
            expect(tsw.sharp('Db')).toEqual('C#');
            expect(tsw.sharp('Ab')).toEqual('G#');
        });

        it('Returns the frequency of a given note', function () {
            expect(tsw.frequency('A4')).toEqual(440.00);
            expect(tsw.frequency('a6')).toEqual(1760.00);
            expect(tsw.frequency('B2')).toEqual(123.47082531403103);
            expect(tsw.frequency('C#3')).toEqual(138.59131548843604);
            expect(tsw.frequency('d#3')).toEqual(155.56349186104046);
            expect(tsw.frequency('eb3')).toEqual(155.56349186104046);
            expect(tsw.frequency('C')).toEqual(261.6255653005986);
            expect(tsw.frequency('D#')).toEqual(311.12698372208087);
            expect(tsw.frequency('eb')).toEqual(311.12698372208087);
            expect(tsw.frequency('Not a note')).toEqual(false);
            expect(tsw.frequency(123)).toEqual(false);
        });

        it('Get notes from given chord', function () {
            expect(tsw.chord('C', 'major')).toEqual(['C', 'E', 'G', 'C']);
            expect(tsw.chord('c')).toEqual(['C', 'E', 'G', 'C']);
        });

        it('Get scale from given note', function () {
            expect(tsw.scale ('C', 'major')).toEqual([ 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C' ]);
            expect(tsw.scale('D', 'minor')).toEqual([ 'D', 'E', 'F', 'G', 'A', 'A#', 'C', 'D']);
        });
    });

    describe('Midi', function () {
        it('Gets note name from given number', function () {
            expect(tsw.midiNote(0)).toEqual('C0');
            expect(tsw.midiNote(48)).toEqual('C4');
            expect(tsw.midiNote(30)).toEqual('F#2');
            expect(tsw.midiNote(111)).toEqual('D#9');
        });

        it('Gets midi number from given note name', function () {
            expect(tsw.midiNote('C0')).toEqual(0);
            expect(tsw.midiNote('C4')).toEqual(48);
            expect(tsw.midiNote('F#2')).toEqual(30);
            expect(tsw.midiNote('d#9')).toEqual(111);
        });
    });
});
