import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert, StatusBar } from 'react-native';
import { predictRisk } from './src/modelApi';

const navy='#142B50', maroon='#8D1831', gold='#DFAF47', pale='#F4F6FA';
const initial = { studentId:'DEMO-001', program:'Master in Information Technology', gpa:'1.75', attendance:'92', completedUnits:'18', enrolledUnits:'9', missedTerms:'0' };
const fields = [
  ['gpa','GPA / academic average'],['attendance','Attendance (%)'],['completedUnits','Completed units'],
  ['enrolledUnits','Currently enrolled units'],['missedTerms','Missed enrolment terms']
];
function Card({children,style}) {return <View style={[styles.card,style]}>{children}</View>}
function Heading({children}) {return <Text style={styles.heading}>{children}</Text>}
export default function App(){
 const [tab,setTab]=useState('Dashboard'); const [form,setForm]=useState(initial);
 const [result,setResult]=useState(null); const [busy,setBusy]=useState(false);
 const [demo,setDemo]=useState(true);
 const update=(k,v)=>setForm(p=>({...p,[k]:v}));
 const run=async()=>{
  const numeric=Object.fromEntries(fields.map(([k])=>[k,Number(form[k])]));
  if(fields.some(([k])=>form[k].trim()===''||!Number.isFinite(numeric[k])) || numeric.attendance<0 || numeric.attendance>100 || Object.values(numeric).some(n=>n<0)){
    Alert.alert('Check inputs','Enter valid non-negative numbers; attendance must be 0–100.'); return;
  }
  setBusy(true);
  try {
   if(demo){
    // Deliberately fixed illustrative output: not a prediction or risk calculation.
    setResult({risk_level:'Moderate',risk_probability:null,explanation:['Example output only — no trained model is running.','Connect a trained model to generate evidence-based predictions.'],is_demo:true});
   }else{
    const r=await predictRisk({...numeric,student_id:form.studentId,program:form.program});
    setResult({...r,is_demo:false});
   }
   setTab('Results');
  } catch(e){Alert.alert('Model unavailable',e.message==='MODEL_NOT_CONNECTED'?'Set EXPO_PUBLIC_MODEL_API_URL and start your prediction server.':e.message)}
  finally{setBusy(false)}
 };
 return <SafeAreaView style={styles.root}><StatusBar barStyle="light-content" backgroundColor={navy}/>
  <View style={styles.header}><Text style={styles.brand}>GradPredict</Text><Text style={styles.subbrand}>CU Graduate School • Capstone Prototype</Text></View>
  <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
  {tab==='Dashboard'&&<>
    <Text style={styles.eyebrow}>STUDENT SUCCESS ANALYTICS</Text><Text style={styles.hero}>Academic Progress & Retention</Text>
    <Text style={styles.desc}>A mobile prototype preparing for Random Forest integration. All student details shown are fictional.</Text>
    <Card><Text style={styles.muted}>Sample student</Text><Text style={styles.big}>{form.studentId}</Text><Text style={styles.desc}>{form.program}</Text></Card>
    <View style={styles.metrics}><Card style={styles.metric}><Text style={styles.muted}>Completed units</Text><Text style={styles.number}>{form.completedUnits}</Text></Card><Card style={styles.metric}><Text style={styles.muted}>Attendance</Text><Text style={styles.number}>{form.attendance}%</Text></Card></View>
    <Card><Heading>How it works</Heading><Text style={styles.line}>1. Enter academic indicators in the Assessment tab.</Text><Text style={styles.line}>2. Preview the interface with demonstration output.</Text><Text style={styles.line}>3. Later, connect your trained model through an API.</Text></Card>
    <Pressable style={styles.primary} onPress={()=>setTab('Assessment')}><Text style={styles.primaryText}>Start Assessment →</Text></Pressable>
  </>}
  {tab==='Assessment'&&<>
    <Text style={styles.hero}>Academic Risk Assessment</Text><Text style={styles.desc}>Enter sample information to test the application. Do not use real student records without approval.</Text>
    <Card><Text style={styles.fieldLabel}>Student ID</Text><TextInput style={styles.input} value={form.studentId} onChangeText={v=>update('studentId',v)} />
    <Text style={styles.fieldLabel}>Graduate program</Text><TextInput style={styles.input} value={form.program} onChangeText={v=>update('program',v)}/>
    {fields.map(([key,label])=><View key={key}><Text style={styles.fieldLabel}>{label}</Text><TextInput style={styles.input} value={form[key]} onChangeText={v=>update(key,v)} keyboardType="decimal-pad" /></View>)}
    </Card>
    <Card><Heading>Prediction mode</Heading><Pressable style={styles.mode} onPress={()=>{setDemo(!demo);setResult(null)}}><Text style={styles.modeText}>{demo?'● Demo output (no ML model)':'○ Live API mode (requires server)'}</Text><Text style={styles.muted}>Tap to switch modes</Text></Pressable></Card>
    <Pressable style={styles.primary} disabled={busy} onPress={run}><Text style={styles.primaryText}>{busy?'Processing…':'Generate Assessment →'}</Text></Pressable>
  </>}
  {tab==='Results'&&<>
    <Text style={styles.hero}>Assessment Results</Text>
    {!result?<Card><Text style={styles.desc}>No assessment yet. Complete the Assessment form first.</Text></Card>:<>
      <Card><Text style={styles.muted}>{result.is_demo?'ILLUSTRATIVE DEMONSTRATION — NOT A PREDICTION':'MODEL-GENERATED RESULT'}</Text>
      <Text style={[styles.risk,{color:result.risk_level==='High'?'#B42318':result.risk_level==='Moderate'?'#A65D09':'#16805D'}]}>{result.risk_level} Risk</Text>
      {typeof result.risk_probability==='number'&&<Text style={styles.desc}>Estimated probability: {(result.risk_probability*100).toFixed(1)}%</Text>}
      </Card>
      <Card><Heading>Explanation</Heading>{(result.explanation||['No explanation returned.']).map((x,i)=><Text key={i} style={styles.line}>• {x}</Text>)}</Card>
      <Card><Heading>Suggested next steps</Heading><Text style={styles.line}>• Review academic progress with an authorised adviser.</Text><Text style={styles.line}>• Verify data accuracy before taking action.</Text><Text style={styles.line}>• Never use model output as the sole basis for decisions.</Text></Card>
      <Text style={styles.disclaimer}>Prototype only. Not validated for real student assessment or institutional decision-making.</Text>
    </>}
    <Pressable style={styles.primary} onPress={()=>setTab('Assessment')}><Text style={styles.primaryText}>Back to Assessment</Text></Pressable>
  </>}
  {tab==='About'&&<><Text style={styles.hero}>About GradPredict</Text><Card><Heading>Project concept</Heading><Text style={styles.line}>Intelligent Student Retention and Academic Risk Prediction System using Business Intelligence and Machine Learning.</Text></Card><Card><Heading>Future integration</Heading><Text style={styles.line}>• Train Random Forest using an approved dataset.</Text><Text style={styles.line}>• Deploy a Python FastAPI /predict endpoint.</Text><Text style={styles.line}>• Connect the mobile app using HTTPS.</Text><Text style={styles.line}>• Add role-based access and privacy safeguards.</Text><Text style={styles.line}>• Evaluate model quality and fairness before use.</Text></Card><Text style={styles.disclaimer}>Independent academic prototype; not an official Capitol University application.</Text></>}
  </ScrollView>
  <View style={styles.nav}>{['Dashboard','Assessment','Results','About'].map(t=><Pressable key={t} style={[styles.navItem,tab===t&&styles.navActive]} onPress={()=>setTab(t)}><Text style={[styles.navText,tab===t&&styles.navSelected]}>{t}</Text></Pressable>)}</View>
 </SafeAreaView>
}
const styles=StyleSheet.create({root:{flex:1,backgroundColor:pale},header:{backgroundColor:navy,paddingHorizontal:22,paddingVertical:18},brand:{color:'white',fontWeight:'800',fontSize:26},subbrand:{color:'#CED8E7',fontSize:12,marginTop:3},content:{padding:18,paddingBottom:28},eyebrow:{color:maroon,fontWeight:'800',fontSize:11,letterSpacing:1.2,marginTop:10},hero:{color:navy,fontSize:27,fontWeight:'800',marginTop:8,marginBottom:8},desc:{color:'#596579',fontSize:14,lineHeight:21,marginBottom:10},card:{backgroundColor:'white',borderRadius:16,padding:18,marginVertical:8,borderWidth:1,borderColor:'#E6EAF0'},muted:{fontSize:12,color:'#67768B'},big:{fontSize:22,fontWeight:'800',color:navy,marginTop:6},metrics:{flexDirection:'row',gap:10},metric:{flex:1},number:{fontSize:24,fontWeight:'800',color:maroon,marginTop:8},heading:{fontSize:17,fontWeight:'800',color:navy,marginBottom:12},line:{fontSize:14,color:'#39465B',lineHeight:23,marginBottom:5},primary:{backgroundColor:maroon,padding:17,borderRadius:13,alignItems:'center',marginTop:12},primaryText:{color:'white',fontWeight:'800',fontSize:15},fieldLabel:{fontSize:13,fontWeight:'700',color:navy,marginBottom:7,marginTop:10},input:{borderWidth:1,borderColor:'#D9E0E9',borderRadius:10,padding:12,fontSize:15,color:navy,backgroundColor:'#FAFBFD'},mode:{padding:12,borderRadius:10,backgroundColor:'#F6F7FA'},modeText:{fontWeight:'700',color:navy,marginBottom:4},risk:{fontSize:32,fontWeight:'900',marginTop:12,marginBottom:8},disclaimer:{fontSize:12,color:'#7A5960',lineHeight:18,marginTop:10},nav:{flexDirection:'row',backgroundColor:'white',borderTopWidth:1,borderTopColor:'#E5E8EF',padding:6},navItem:{flex:1,alignItems:'center',paddingVertical:12,borderRadius:9},navActive:{backgroundColor:'#F8EAF0'},navText:{fontSize:11,fontWeight:'700',color:'#657085'},navSelected:{color:maroon}});
