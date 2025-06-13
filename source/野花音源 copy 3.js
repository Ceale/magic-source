/**
 * @name 野花🌷
 * @version 1.0.0
 */

function O(){
	const R=['3934685EJsypn','4155220shjmqd','code','hash','copyrightI','GET','hex','gSyEM','4009336twNHZx','QTdcX','vMIuN','acGOz','iamzW','kw|128k&wy','/url/','nNhDn','bufToStrin','119924Zhuara','lx-music/','stringify','wer.tempmu','data','QVjzE','/urlinfo/','musicUrl','1510707iVmAso','md5','CxlIL','match','request','959116lEWWZC','songmid','sources','http://flo','buffer','14NoiTNH','split','5159PfWaop','inited','DFjbN','|128k&mg|1','sics.tk/v1','10878XneaKF','tag','from','KEWEM','3MhKFyJ','wrDDF','QXcEI','uITgx','28k&tx|128','ILkJK','FhkNH','crypto','服务器异常','failed','FpTmP','156KGDOun','msg','fialed','body','k&kg|128k','LCTQX','shift','PkJlH','xTmgg','music','rawScript','9WQyvje','version','updateAler','trim','lecSG'];
	O=function(){
		return R;
	};
	return O();
}
function Z(Y,L){
	const K=O();
	Z=function(U,H){
		U=U-345;
		let S=K[U];
		return S;
	};
	return Z(Y,L);
}
(function(Y,L){
	const K=Y();
	while(true){
		try{
			const U=parseInt(Z('0x190'))/1*(parseInt(Z(345))/2)+-parseInt(Z('0x164'))/3*(parseInt(Z('0x19d'))/4)+parseInt(Z(383))/5+-parseInt(Z(352))/6*(parseInt(Z('0x15b'))/7)+-parseInt(Z(391))/8*(parseInt(Z(378))/9)+-parseInt(Z('0x180'))/10+-parseInt(Z(408))/11*(-parseInt(Z(367))/12);
			if(U===L){
				break;
			}else{
				K.push(K.shift());
			}
		}catch(H){
			K.push(K.shift());
		}
	}
})(O,919137);
const{EVENT_NAMES:e,request:t,on:r,send:o,env:s,version:d,currentScriptInfo:i,utils:u}=globalThis.lx;
const getId=(Y,L)=>{
	const K={'wrDDF':function(U,H){
		return U(H);
	},'uITgx':Z(365)};
	switch(Y){
		case 'tx':
		case 'wy':
		case 'kw':
			return L[Z('0x19e')];
		case 'kg':
			return L[Z(386)];
		case 'mg':
			return L[Z('0x183')+'d'];
	}
	throw K[Z('0x165')](Error,K[Z(359)]);
};
const headers={'User-Agent':Z(401)+s,'ver':d,'source-ver':i[Z('0x17b')]};
r(e[Z('0x19c')],({source:Y,action:L,info:{musicInfo:K,type:U}})=>{
	const H={'vMIuN':function(S,N,B){
		return S(N,B);
	},'QXcEI':Z(389),'LCTQX':function(S,N,B,v){
		return S(N,B,v);
	},'iamzW':function(S,N){
		return S+N;
	},'PkJlH':Z('0x1a0')+Z(403)+Z('0x15f'),'nNhDn':Z('0x184'),'QTdcX':function(S,N){
		return S!=N;
	},'acGOz':Z(407),'DFjbN':function(S,N){
		return S(N);
	},'ILkJK':Z(369)};
	if(H[Z(392)](H[Z('0x18a')],L)){
		throw H[Z('0x15d')](Error,H[Z('0x169')]);
	}
	return new Promise((S,N)=>{
		let B=Z('0x18d')+Y+'/'+H[Z('0x189')](getId,Y,K)+'/'+U;
		headers[Z(353)]=u[Z(417)][Z('0x18f')+'g'](u[Z('0x1a1')][Z(354)](JSON[Z(402)](B[Z(411)](/(?:\d\w)+/g),null,1)),H[Z('0x166')]);
		H[Z(372)](t,H[Z(395)](H[Z(374)],B),{'method':H[Z('0x18e')],'headers':headers},(v,G)=>v?N(v):0!==G[Z(370)][Z('0x181')]?N(Error(G[Z(370)][Z(368)])):void S(G[Z('0x172')][Z('0x194')]));
	});
});
t(Z('0x1a0')+Z('0x193')+Z(351)+Z('0x196')+i[Z('0x17b')],{'method':Z('0x184'),'headers':headers},(U,H)=>{
	const S={'lecSG':Z('0x18c')+Z(350)+Z('0x168')+Z(371),'KEWEM':function(M,T){
		return M!==T;
	},'CxlIL':function(M,T){
		return M!=T;
	},'xTmgg':function(M,T){
		return M(T);
	},'FhkNH':Z('0x16c'),'gSyEM':Z(376),'QVjzE':Z('0x197'),'FpTmP':function(M,T,E){
		return M(T,E);
	}};
	const N={[Z('0x181')]:0,s:S[Z('0x17e')]};
	const B={[Z(370)]:N};
	if(U){
		H=B;
	}
	if(S[Z('0x163')](0,H[Z(370)][Z('0x181')])||H[Z(370)].m&&S[Z('0x19a')](u[Z('0x16b')][Z('0x199')](i[Z(377)][Z(381)]()),H[Z(370)].m)){
		throw S[Z(375)](Error,H[Z('0x172')][Z('0x170')]??S[Z(362)]);
	}
	let v={};
	for(let M of H[Z(370)].s[Z('0x17d')]()[Z('0x15a')]('&'))v[(M=M[Z(346)]('|'))[Z('0x175')]()]={'type':S[Z('0x186')],'actions':[S[Z(405)]],'qualitys':M};
	const G={[Z('0x19f')]:v};
	S[Z(366)](o,e[Z(348)],G);
	if(H[Z('0x172')].u){
		S[Z(366)](o,e[Z(380)+'t'],{'log':H[Z(370)].u,'updateUrl':H[Z('0x172')].h});
	}
});